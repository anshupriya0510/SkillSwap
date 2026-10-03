import express from 'express';
import { SkillRequest } from '../models/Request.js';
import { initialRequests } from '../../src/data/requests.js';

const router = express.Router();

// ─── Helper ─────────────────────────────────────────────────────────────────
// Since we have no JWT auth, 'user-me' is the hardcoded currentUser id.
// All permission checks below compare against this constant.
const CURRENT_USER_ID = 'user-me';

// ─── GET all requests ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let requests = await SkillRequest.find().sort({ createdAt: -1 });
    if (requests.length === 0) {
      await SkillRequest.insertMany(initialRequests);
      requests = await SkillRequest.find().sort({ createdAt: -1 });
    }
    res.json(requests);
  } catch (error) {
    res.json(initialRequests);
  }
});

// ─── POST / — Create new request ─────────────────────────────────────────────
// Rules enforced:
//   1. Cannot send a request to yourself
//   2. Cannot send a duplicate Pending request for the same sender/receiver/skill pair
router.post('/', async (req, res) => {
  try {
    const newReqData = req.body;

    // Rule 1: Block self-requests
    if (newReqData.fromUser?.id === newReqData.toUser?.id) {
      return res.status(400).json({ message: 'You cannot send a request to yourself.' });
    }

    // Rule 2: Block duplicate Pending requests (same from + to + skill pair)
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

// ─── PATCH /:id/accept ───────────────────────────────────────────────────────
// Rules: Only the RECEIVER (toUser.id === CURRENT_USER_ID) can accept.
//        Request must currently be Pending.
router.patch('/:id/accept', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    if (request.toUser.id !== CURRENT_USER_ID) {
      return res.status(403).json({ message: 'Only the receiver can accept this request.' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: `Cannot accept a request that is already ${request.status}.`,
      });
    }

    request.status = 'Accepted';
    await request.save();

    res.json({ message: 'Request accepted successfully.', request });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request', error: error.message });
  }
});

// ─── PATCH /:id/reject ───────────────────────────────────────────────────────
// Rules: Only the RECEIVER (toUser.id === CURRENT_USER_ID) can reject.
//        Request must currently be Pending.
router.patch('/:id/reject', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    if (request.toUser.id !== CURRENT_USER_ID) {
      return res.status(403).json({ message: 'Only the receiver can reject this request.' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: `Cannot reject a request that is already ${request.status}.`,
      });
    }

    request.status = 'Rejected';
    await request.save();

    res.json({ message: 'Request rejected.', request });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error: error.message });
  }
});

// ─── PATCH /:id/cancel ──────────────────────────────────────────────────────
// Rules: Only the SENDER (fromUser.id === CURRENT_USER_ID) can cancel.
//        Request must currently be Pending.
router.patch('/:id/cancel', async (req, res) => {
  try {
    const request = await SkillRequest.findOne({ id: req.params.id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    if (request.fromUser.id !== CURRENT_USER_ID) {
      return res.status(403).json({ message: 'Only the sender can cancel this request.' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: `Cannot cancel a request that is already ${request.status}.`,
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.json({ message: 'Request cancelled.', request });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling request', error: error.message });
  }
});

// ─── PATCH /:id — Generic status update (kept for backward compatibility) ────
// NOTE: This route has no permission checks and is used by the legacy frontend.
// New actions (accept/reject/cancel/schedule/complete) should use the specific routes above.
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReq = await SkillRequest.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!updatedReq) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(updatedReq);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
});

export default router;
