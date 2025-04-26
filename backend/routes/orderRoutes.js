import express from 'express';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { userDetails, products, totalAmount, shippingFee } = req.body;
    
    const newOrder = new Order({
      userId: req.user.id,
      userDetails,
      products,
      totalAmount,
      shippingFee: shippingFee || 30000,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders for a user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
