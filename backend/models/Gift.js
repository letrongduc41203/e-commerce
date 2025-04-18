import mongoose from 'mongoose';
const giftSchema = new mongoose.Schema({
  image: String
});
const Gift = mongoose.model('Gift', giftSchema);
export default Gift;
