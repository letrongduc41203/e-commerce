import express from 'express';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Admin middleware - kiểm tra xem user có phải admin không
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !(req.user.role === 'admin' || req.user.isSuperAdmin === true)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
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

// === ADMIN ROUTES ===

// Get all orders (Admin only)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    // Phân trang và sắp xếp
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-createdAt'; // Mặc định sắp xếp theo ngày tạo mới nhất
    
    // Tìm kiếm và lọc
    const filterOptions = {};
    
    // Lọc theo trạng thái nếu có
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    // Tìm kiếm theo userId hoặc email nếu có
    if (req.query.search) {
      filterOptions.$or = [
        { 'userDetails.email': { $regex: req.query.search, $options: 'i' } },
        { 'userDetails.name': { $regex: req.query.search, $options: 'i' } }
      ];
      
      // Check if search is a valid ObjectId
      if (req.query.search.match(/^[0-9a-fA-F]{24}$/)) {
        filterOptions.$or.push({ _id: req.query.search });
        filterOptions.$or.push({ userId: req.query.search });
      }
    }
    
    // Lấy tổng số đơn hàng (cho phân trang)
    const total = await Order.countDocuments(filterOptions);
    
    // Lấy danh sách đơn hàng
    const orders = await Order.find(filterOptions)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    res.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật trạng thái đơn hàng (Admin only)
router.patch('/admin/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Cập nhật trạng thái đơn hàng
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Xem chi tiết đơn hàng (Admin)
router.get('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
