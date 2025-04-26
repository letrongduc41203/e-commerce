import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String
  },
  products: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    description: String,
    size: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 30000
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  paymentMethod: {
    type: String,
    default: 'Bank Transfer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
