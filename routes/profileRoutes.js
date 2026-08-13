import express from 'express';
import Person from '../models/person.js';
import bcrypt from 'bcrypt';
import { jwtAuthMiddleware } from '../jwt.js';

const router = express.Router();

// GET /profile/me — Get logged-in user's own profile
router.get('/me', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const person = await Person.findById(req.user.id).select('-password');

    if (!person) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
});

// PUT /profile/me — Update logged-in user's own profile
router.put('/me', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.role;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedPerson) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedPerson);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
