import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String },
  image: { type: String, required: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  sku: { type: String },
  slug: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Pre-save hook để tự tạo slug từ tên sản phẩm
productSchema.pre('save', function(next) {
  // Nếu không có slug hoặc sản phẩm mới, tạo slug từ tên
  if (!this.slug || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
