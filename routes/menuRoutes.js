import express from 'express';
import Menu from '../models/menu.js';
import { jwtAuthMiddleware, isManager } from '../jwt.js';
import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory for simplicity

const upload = multer({ storage });

const router = express.Router();

// POST /menu — Add a new menu item (managers only)
router.post('/', jwtAuthMiddleware, isManager, upload.single('photo'), async (req, res, next) => {
  try {
    const { name, price, taste } = req.body;
    let ingredients = req.body.ingredients;

    if (!ingredients && req.body['ingredients[]']) {
      ingredients = Array.isArray(req.body['ingredients[]'])
        ? req.body['ingredients[]']
        : [req.body['ingredients[]']];
    } else if (typeof ingredients === 'string') {
      ingredients = ingredients.split(',').map((ing) => ing.trim()).filter(Boolean);
    }

    const is_drink = req.body.is_drink === 'true' || req.body.is_drink === true;

    const photoBase64 = req.file ? req.file.buffer.toString('base64') : null;
    const photo = photoBase64 ? `data:${req.file.mimetype};base64,${photoBase64}` : req.body.photo;

    const menuData = {
      name,
      price: Number(price),
      taste,
      is_drink,
      ...(ingredients ? { ingredients } : {}),
      ...(photo ? { photo } : {})
    };

    const newMenu = new Menu(menuData);
    const savedMenu = await newMenu.save();

    res.status(201).json(savedMenu);
  } catch (err) {
    // Mongoose validation errors → 400 instead of 500
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// GET /menu — Get all menu items with pagination
// Usage: GET /menu?page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // cap at 50
    const skip = (page - 1) * limit;

    const [menus, total] = await Promise.all([
      Menu.find().skip(skip).limit(limit),
      Menu.countDocuments()
    ]);

    res.json({
      data: menus,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /menu/:taste — Get menu items filtered by taste
router.get('/:taste', async (req, res, next) => {
  try {
    const { taste } = req.params;

    if (!['sweet', 'salty', 'sour'].includes(taste)) {
      return res.status(400).json({ error: 'Invalid taste. Must be: sweet, salty, or sour' });
    }

    const menus = await Menu.find({ taste });
    res.json(menus);
  } catch (err) {
    next(err);
  }
});

// DELETE /menu/:id — Delete a menu item (managers only)
router.delete('/:id', jwtAuthMiddleware, isManager, async (req, res, next) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;