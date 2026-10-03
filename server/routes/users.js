import express from 'express';
import { User } from '../models/User.js';
import { initialUsers, currentUser as defaultCurrentUser } from '../../src/data/users.js';

const router = express.Router();

// Fields safe to expose publicly (contact is EXCLUDED from all public endpoints)
const PUBLIC_FIELDS = '-contact -__v';

// GET /api/users — community list (contact stripped)
router.get('/', async (req, res) => {
  try {
    let users = await User.find({ isCurrentUser: { $ne: true } }).select(PUBLIC_FIELDS);
    if (users.length === 0) {
      await User.insertMany(initialUsers);
      users = await User.find({ isCurrentUser: { $ne: true } }).select(PUBLIC_FIELDS);
    }
    res.json(users);
  } catch (error) {
    res.json(initialUsers.map(({ contact: _c, ...rest }) => rest));
  }
});

// GET /api/users/me — current user (contact INCLUDED — it's their own data)
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

// GET /api/users/:id — public profile (contact stripped)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select(PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    const fallback = initialUsers.find((u) => u.id === req.params.id);
    const { contact: _c, ...safe } = fallback || {};
    res.json(safe || null);
  }
});

// PUT /api/users/me — update current user profile (contact field allowed)
router.put('/me', async (req, res) => {
  try {
    const updatedData = req.body;
    const user = await User.findOneAndUpdate(
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
