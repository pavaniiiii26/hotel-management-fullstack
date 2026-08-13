import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// POST /order — Submit a new customer order
router.post('/', async (req, res, next) => {
  try {
    const { itemName, price, tableNumber, customerNotes, photo } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const order = new Order({
      itemName,
      price: price || 0,
      tableNumber: tableNumber || 1,
      customerNotes: customerNotes || '',
      photo: photo || '',
      status: 'pending',
      createdAt: new Date()
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
});

// GET /order — Get active/pending orders for the kitchen queue
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    // Sort by newest first
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

// PUT /order/:id/status — Update order status (e.g. mark as completed)
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'preparing', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
});

// DELETE /order/clear — Clear completed orders (optional cleanup)
router.delete('/completed', async (req, res, next) => {
  try {
    await Order.deleteMany({ status: 'completed' });
    res.status(200).json({ message: 'Completed orders cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
