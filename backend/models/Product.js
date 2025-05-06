import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  thumbnail: String,
  category: String
});

const Product = mongoose.model('Product', productSchema);
export default Product;
