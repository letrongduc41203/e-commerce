import Product from '../models/Product.js';

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy products' });
  }
};

// Lấy chi tiết sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm' });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req, res) => {
  try {
    const { title, thumbnail, category } = req.body;
    if (!title || !thumbnail || !category) {
      return res.status(400).json({ error: 'Thiếu trường bắt buộc' });
    }
    const newProduct = new Product({ title, thumbnail, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi tạo sản phẩm' });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { title, thumbnail, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    if (title !== undefined) product.title = title;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (category !== undefined) product.category = category;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi cập nhật sản phẩm' });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi xóa sản phẩm' });
  }
};
