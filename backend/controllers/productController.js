import Product from '../models/Product.js';

// Lấy tất cả sản phẩm với phân trang, sắp xếp, lọc và tìm kiếm
export const getProducts = async (req, res) => {
  try {
    // Xử lý phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Xử lý sắp xếp
    let sortBy = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      for (const field of sortFields) {
        if (field.startsWith('-')) {
          sortBy[field.substring(1)] = -1;
        } else {
          sortBy[field] = 1;
        }
      }
    } else {
      // Mặc định sắp xếp theo ngày tạo giảm dần
      sortBy = { createdAt: -1 };
    }
    
    // Xử lý bộ lọc
    const filter = {};
    
    // Lọc theo danh mục
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Lọc theo danh mục con
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }
    
    // Lọc theo featured
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }
    
    // Lọc theo newArrival
    if (req.query.newArrival !== undefined) {
      filter.newArrival = req.query.newArrival === 'true';
    }
    
    // Lọc theo inStock
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }
    
    // Tìm kiếm
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Lọc theo khoảng giá
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseInt(req.query.maxPrice);
      }
    }
    
    // Đếm tổng số sản phẩm theo bộ lọc
    const total = await Product.countDocuments(filter);
    
    // Lấy sản phẩm theo bộ lọc, phân trang và sắp xếp
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy products' });
  }
};

// Lấy chi tiết sản phẩm theo id hoặc slug
export const getProductById = async (req, res) => {
  try {
    let product;
    const { id } = req.params;
    
    // Kiểm tra nếu id là ObjectId hoặc slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Nếu là ObjectId
      product = await Product.findById(id);
    } else {
      // Nếu là slug
      product = await Product.findOne({ slug: id });
    }
    
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm' });
  }
};

// Tạo mới sản phẩm (Admin only)
export const createProduct = async (req, res) => {
  try {
    // Kiểm tra quyền admin đã được xử lý ở middleware
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      subcategory,
      image,
      images,
      sizes,
      colors,
      inStock,
      quantity,
      featured,
      newArrival,
      sku
    } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!name || !price || !category || !image) {
      return res.status(400).json({ error: 'Thiếu trường bắt buộc: tên sản phẩm, giá, danh mục và hình ảnh' });
    }
    
    // Tạo sku mới nếu không có
    const generatedSku = sku || `${category.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
    
    // Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      subcategory,
      image,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      inStock: inStock !== undefined ? inStock : true,
      quantity: quantity || 0,
      featured: featured || false,
      newArrival: newArrival || false,
      sku: generatedSku
    });
    
    await newProduct.save();
    res.status(201).json({
      message: 'Sản phẩm đã được tạo thành công',
      product: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Lỗi server khi tạo sản phẩm', details: err.message });
  }
};

// Cập nhật sản phẩm (Admin only)
export const updateProduct = async (req, res) => {
  try {
    // Kiểm tra quyền admin đã được xử lý ở middleware
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    
    // Cập nhật các trường
    const updateFields = [
      'name', 'description', 'price', 'discountPrice', 'category', 'subcategory',
      'image', 'images', 'sizes', 'colors', 'inStock', 'quantity', 'featured',
      'newArrival', 'sku', 'slug'
    ];
    
    // Cập nhật các trường nếu có trong request
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    
    // Cập nhật ngày cập nhật
    product.updatedAt = Date.now();
    
    await product.save();
    res.json({
      message: 'Sản phẩm đã được cập nhật thành công',
      product
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Lỗi server khi cập nhật sản phẩm', details: err.message });
  }
};

// Xóa sản phẩm (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    // Kiểm tra quyền admin đã được xử lý ở middleware
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Lỗi server khi xóa sản phẩm' });
  }
};

// Admin Actions

// Lấy tất cả sản phẩm có phân trang và sắp xếp (Admin Dashboard)
export const getAdminProducts = async (req, res) => {
  try {
    // Phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Admin thường xem nhiều sản phẩm hơn
    const skip = (page - 1) * limit;
    
    // Sắp xếp
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortBy = { [sortField]: sortOrder };
    
    // Tìm kiếm
    let filter = {};
    if (req.query.search) {
      filter = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { sku: { $regex: req.query.search, $options: 'i' } },
          { category: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    
    // Lọc theo trạng thái kho
    if (req.query.stockStatus) {
      if (req.query.stockStatus === 'inStock') {
        filter.inStock = true;
      } else if (req.query.stockStatus === 'outOfStock') {
        filter.inStock = false;
      }
    }
    
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    // Response với dữ liệu thống kê cho admin
    const statsPromises = [
      Product.countDocuments({ inStock: true }),
      Product.countDocuments({ inStock: false }),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ newArrival: true })
    ];
    
    const [inStockCount, outOfStockCount, featuredCount, newArrivalCount] = await Promise.all(statsPromises);
    
    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      stats: {
        inStock: inStockCount,
        outOfStock: outOfStockCount,
        featured: featuredCount,
        newArrival: newArrivalCount,
        total
      }
    });
  } catch (err) {
    console.error('Error fetching admin products:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách sản phẩm cho admin' });
  }
};

// Cập nhật hàng loạt nhiều sản phẩm (Admin only)
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách sản phẩm không hợp lệ' });
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Không có thông tin cập nhật' });
    }
    
    // Lọc các trường được phép cập nhật hàng loạt
    const allowedBulkUpdateFields = [
      'inStock', 'featured', 'newArrival', 'discountPrice',
      'category', 'subcategory'
    ];
    
    const safeUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedBulkUpdateFields.includes(key)) {
        safeUpdates[key] = updates[key];
      }
    });
    
    // Thêm ngày cập nhật
    safeUpdates.updatedAt = Date.now();
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: safeUpdates }
    );
    
    res.json({
      message: 'Cập nhật hàng loạt sản phẩm thành công',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (err) {
    console.error('Error bulk updating products:', err);
    res.status(500).json({ error: 'Lỗi server khi cập nhật hàng loạt sản phẩm' });
  }
};

// Xóa hàng loạt sản phẩm (Admin only)
export const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách sản phẩm không hợp lệ' });
    }
    
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.json({
      message: 'Xóa hàng loạt sản phẩm thành công',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error bulk deleting products:', err);
    res.status(500).json({ error: 'Lỗi server khi xóa hàng loạt sản phẩm' });
  }
};
