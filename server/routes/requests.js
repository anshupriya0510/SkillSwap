import express from 'express';
import { SkillRequest } from '../models/Request.js';
import { User } from '../models/User.js';
import { initialRequests } from '../../src/data/requests.js';

const router = express.Router();

// ─── Constant ─────────────────────────────────────────────────────────────────
// No JWT auth in this project — current user is always 'user-me'.
const CURRENT_USER_ID = 'user-me';

// Statuses that allow contact details to be revealed
const CONTACT_VISIBLE_STATUSES = ['Accepted', 'Scheduled', 'Completed'];

// ─── Helper: attach other user's contact to a request (if eligible) ──────────
// For a received request  → otherUser is fromUser
// For a sent request      → otherUser is toUser
// Contact is only appended when status is Accepted/Scheduled/Completed.
async function attachContact(request) {
  const doc = request.toObject ? request.toObject() : { ...request };
  if (!CONTACT_VISIBLE_STATUSES.includes(doc.status)) return doc;

  const otherUserId =
    doc.direction === 'received' ? doc.fromUser?.id : doc.toUser?.id;
  if (!otherUserId) return doc;

  try {
    const otherUser = await User.findOne({ id: otherUserId }).select('contact').lean();
    if (otherUser?.contact?.value) {
      doc.otherUserContact = otherUser.contact;
    }
  } catch (_) {
    // silently skip — contact is a nice-to-have, not blocking
  }
  return doc;
}

// ─── GET / — All requests for current user (with safe contact gating) ─────────
router.get('/', async (req, res) => {
  try {
    let requests = await SkillRequest.find().sort({ createdAt: -1 });
    if (requests.length === 0) {
      await SkillRequest.insertMany(initialRequests);
      requests = await SkillRequest.find().sort({ createdAt: -1 });
    }
    // Attach contact only for eligible statuses
    const result = await Promise.all(requests.map(attachContact));
    res.json(result);
  } catch (error) {
    res.json(initialRequests);
  }
});

// ─── POST / — Create new request ──────────────────────────────────────────────
// Rules: no self-requests, no duplicate pending pairs
router.post('/', async (req, res) => {
  try {
    const newReqData = req.body;

    if (newReqData.fromUser?.id === newReqData.toUser?.id) {
      return res.status(400).json({ message: 'You cannot send a request to yourself.' });
    }

    const existing = await SkillRequest.findOne({
      'fromUser.id': newReqData.fromUser?.id,
      'toUser.id': newReqData.toUser?.id,
      mySkillToTeach: newReqData.mySkillToTeach,
      theirSkillToTeach: newReqData.theirSkillToTeach,
      status: 'Pending',
    });

    if (existing) {
      return res.status(409).json({
        message: 'A pending request already exists for this skill pair with this user.',
      });
    }

    const createdReq = await SkillRequest.create(newReqData);
    res.status(201).json(createdReq);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// ─── PATCH /:id/accept ────────────────────────────────────────────────────────
// Only receiver, only Pending → Accepted
router.patch('/:id/accept', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.toUser.id !== CURRENT_USER_ID)
      return res.status(403).json({ message: 'Only the receiver can accept this request.' });
    if (request.status !== 'Pending')
      return res.status(400).json({ message: `Cannot accept a request with status: ${request.status}.` });

    request.status = 'Accepted';
    await request.save();

    const result = await attachContact(request);
    res.json({ message: 'Request accepted successfully.', request: result });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request', error: error.message });
  }
});

// ─── PATCH /:id/reject ────────────────────────────────────────────────────────
// Only receiver, only Pending → Rejected
router.patch('/:id/reject', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.toUser.id !== CURRENT_USER_ID)
      return res.status(403).json({ message: 'Only the receiver can reject this request.' });
    if (request.status !== 'Pending')
      return res.status(400).json({ message: `Cannot reject a request with status: ${request.status}.` });

    request.status = 'Rejected';
    await request.save();
    res.json({ message: 'Request rejected.', request });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error: error.message });
  }
});

// ─── PATCH /:id/cancel ────────────────────────────────────────────────────────
// Only sender, only Pending → Cancelled
router.patch('/:id/cancel', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.fromUser.id !== CURRENT_USER_ID)
      return res.status(403).json({ message: 'Only the sender can cancel this request.' });
    if (request.status !== 'Pending')
      return res.status(400).json({ message: `Cannot cancel a request with status: ${request.status}.` });

    request.status = 'Cancelled';
    await request.save();
    res.json({ message: 'Request cancelled.', request });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling request', error: error.message });
  }
});

// ─── PATCH /:id/schedule ─────────────────────────────────────────────────────
// Either user, only Accepted → Scheduled. Requires sessionLink + sessionTime.
router.patch('/:id/schedule', async (req, res) => {
  try {
    const { sessionLink, sessionTime } = req.body;
    if (!sessionLink || !sessionTime) {
      return res.status(400).json({ message: 'sessionLink and sessionTime are required.' });
    }

    const request = await SkillRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    // Either user involved in this request may schedule
    const isInvolved =
      request.fromUser.id === CURRENT_USER_ID || request.toUser.id === CURRENT_USER_ID;
    if (!isInvolved)
      return res.status(403).json({ message: 'You are not part of this request.' });
    if (request.status !== 'Accepted')
      return res.status(400).json({ message: `Can only schedule an Accepted request. Current status: ${request.status}.` });

    request.status = 'Scheduled';
    request.sessionLink = sessionLink;
    request.sessionTime = sessionTime;
    await request.save();

    const result = await attachContact(request);
    res.json({ message: 'Session scheduled successfully.', request: result });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling session', error: error.message });
  }
});

// ─── PATCH /:id/complete ─────────────────────────────────────────────────────
// Either user, only Scheduled → Completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    const isInvolved =
      request.fromUser.id === CURRENT_USER_ID || request.toUser.id === CURRENT_USER_ID;
    if (!isInvolved)
      return res.status(403).json({ message: 'You are not part of this request.' });
    if (request.status !== 'Scheduled')
      return res.status(400).json({ message: `Can only complete a Scheduled request. Current status: ${request.status}.` });

    request.status = 'Completed';
    await request.save();

    const result = await attachContact(request);
    res.json({ message: 'Exchange marked as completed! 🎉', request: result });
  } catch (error) {
    res.status(500).json({ message: 'Error completing request', error: error.message });
  }
});

// ─── PATCH /:id — Generic fallback (kept for backward compat, no new uses) ───
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReq = await SkillRequest.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!updatedReq) return res.status(404).json({ message: 'Request not found' });
    res.json(updatedReq);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
});

export default router;
