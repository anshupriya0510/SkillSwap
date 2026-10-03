import express from 'express';
import { User } from '../models/User.js';
import { initialUsers, currentUser as defaultCurrentUser } from '../../src/data/users.js';

const router = express.Router();

// GET all community users
router.get('/', async (req, res) => {
  try {
    let users = await User.find({ isCurrentUser: { $ne: true } });
    if (users.length === 0) {
      // Seed default initial users if MongoDB collection is empty
      await User.insertMany(initialUsers);
      users = await User.find({ isCurrentUser: { $ne: true } });
    }
    res.json(users);
  } catch (error) {
    // Fallback response with initial data
    res.json(initialUsers);
  }
});

// GET logged-in current user
router.get('/me', async (req, res) => {
  try {
    let user = await User.findOne({ id: defaultCurrentUser.id });
    if (!user) {
      user = await User.create({ ...defaultCurrentUser, isCurrentUser: true });
    }
    res.json(user);
  } catch (error) {
    res.json(defaultCurrentUser);
  }
});

// GET single user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    const fallback = initialUsers.find((u) => u.id === req.params.id);
    res.json(fallback || null);
  }
});

// PUT /api/users/me - Update logged-in user profile
router.put('/me', async (req, res) => {
  try {
    const updatedData = req.body;
    let user = await User.findOneAndUpdate(
      { id: defaultCurrentUser.id },
      { $set: updatedData },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

export default router;
