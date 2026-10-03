import express from 'express';
import { SkillRequest } from '../models/Request.js';
import { initialRequests } from '../../src/data/requests.js';

const router = express.Router();

// GET all requests
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

// POST create new request
router.post('/', async (req, res) => {
  try {
    const newReqData = req.body;
    const createdReq = await SkillRequest.create(newReqData);
    res.status(201).json(createdReq);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// PATCH update status of a request (Accepted / Rejected)
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
