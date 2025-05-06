import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
  description: String,
  longDescription: String,
});

const MenSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String,
  description: String,
  banner: String,
  modelImage: String,
  products: [ProductSchema],
});

const Men = mongoose.model('Men', MenSchema);

export default Men;
