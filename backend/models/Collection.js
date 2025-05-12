import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
  season: String,
  description: String,
  longDescription: String
});

const collectionSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  slug: String,
  banner: String,
  modelImage: String,
  products: [productSchema]
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
