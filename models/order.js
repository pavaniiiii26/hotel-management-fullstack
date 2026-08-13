import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  tableNumber: {
    type: Number,
    default: 1
  },
  customerNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed'],
    default: 'pending'
  },
  photo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
