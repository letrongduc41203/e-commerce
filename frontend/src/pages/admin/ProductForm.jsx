import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Upload, X, Plus, Trash } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    brand: '',
    countInStock: '',
    sku: '',
    slug: '',
    featured: false,
    sizes: [],
    colors: [],
    specifications: []
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [tempSize, setTempSize] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempSpecKey, setTempSpecKey] = useState('');
  const [tempSpecValue, setTempSpecValue] = useState('');
  
  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }
        
        const response = await axios.get(`${API_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const product = response.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          image: product.image || '',
          category: product.category || '',
          brand: product.brand || '',
          countInStock: product.countInStock || '',
          sku: product.sku || '',
          slug: product.slug || '',
          featured: product.featured || false,
          sizes: product.sizes || [],
          colors: product.colors || [],
          specifications: product.specifications || []
        });
        
        setPreviewImage(product.image || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product data:', err);
        alert('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        navigate('/admin/products');
      }
    };
    
    fetchProductData();
  }, [id, isEditMode, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Simple validation
    if (!file.type.match('image.*')) {
      alert('Vui lòng chọn một file hình ảnh');
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the image to a server here
    // and get back a URL to store in formData
    
    // Mock image URL for demo
    setFormData(prev => ({
      ...prev,
      image: URL.createObjectURL(file) // This is temporary and will be replaced with actual upload
    }));
  };
  
  // Add a size
  const handleAddSize = () => {
    if (!tempSize.trim()) return;
    
    if (!formData.sizes.includes(tempSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, tempSize]
      }));
    }
    
    setTempSize('');
  };
  
  // Remove a size
  const handleRemoveSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };
  
  // Add a color
  const handleAddColor = () => {
    if (!tempColor.trim()) return;
    
    if (!formData.colors.includes(tempColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, tempColor]
      }));
    }
    
    setTempColor('');
  };
  
  // Remove a color
  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };
  
  // Add a specification
  const handleAddSpecification = () => {
    if (!tempSpecKey.trim() || !tempSpecValue.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { key: tempSpecKey, value: tempSpecValue }
      ]
    }));
    
    setTempSpecKey('');
    setTempSpecValue('');
  };
  
  // Remove a specification
  const handleRemoveSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Mô tả sản phẩm không được để trống';
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    
    if (!formData.image) {
      errors.image = 'Hình ảnh sản phẩm không được để trống';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Danh mục sản phẩm không được để trống';
    }
    
    if (!formData.countInStock || formData.countInStock < 0) {
      errors.countInStock = 'Số lượng trong kho không được âm';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      let response;
      
      if (isEditMode) {
        // Update existing product
        response = await axios.put(`${API_URL}/products/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Create new product
        response = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      alert(isEditMode ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      
      if (err.response && err.response.data && err.response.data.errors) {
        // Show validation errors from server
        setValidationErrors(err.response.data.errors);
      } else {
        alert(`Không thể ${isEditMode ? 'cập nhật' : 'thêm'} sản phẩm. Vui lòng thử lại sau.`);
      }
      
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg font-medium">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold ml-4">
          {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Left and Right Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên sản phẩm"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mô tả sản phẩm"
                ></textarea>
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
                )}
              </div>
              
              {/* Two columns for price, stock, category, brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full border rounded-md pl-3 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập giá sản phẩm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">VND</span>
                    </div>
                  </div>
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.price}</p>
                  )}
                </div>
                
                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng trong kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.countInStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số lượng"
                  />
                  {validationErrors.countInStock && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.countInStock}</p>
                  )}
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Shirts">Áo</option>
                    <option value="Pants">Quần</option>
                    <option value="Shoes">Giày</option>
                    <option value="Accessories">Phụ kiện</option>
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
                  )}
                </div>
                
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập thương hiệu"
                  />
                </div>
                
                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã SKU"
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Để trống sẽ tự động tạo từ tên"
                  />
                  <p className="mt-1 text-xs text-gray-500">Để trống sẽ tự động tạo từ tên sản phẩm</p>
                </div>
                
                {/* Featured checkbox */}
                <div className="col-span-full">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Sản phẩm nổi bật
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm <span className="text-red-500">*</span>
              </label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-60">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={previewImage} 
                      alt="Product preview"
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">
                      Kéo và thả hoặc click để tải lên
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP tối đa 5MB
                    </p>
                  </div>
                )}
                
                {/* Hidden file input */}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Upload size={16} className="mr-2" />
                Chọn hình ảnh
              </button>
              
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.image}</p>
              )}
            </div>
          </div>
          
          {/* Sizes, Colors and Specifications */}
          <div className="border-t pt-6 space-y-6">
            <h2 className="text-lg font-semibold">Thông tin bổ sung</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước sản phẩm
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.sizes.map((size, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{size}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={tempSize}
                    onChange={(e) => setTempSize(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thêm kích thước (vd: S, M, L, XL)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc sản phẩm
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{color}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thêm màu sắc (vd: Đen, Trắng, Xanh)"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông số kỹ thuật
              </label>
              
              <div className="mb-3">
                {formData.specifications.length > 0 ? (
                  <div className="bg-gray-50 rounded-md p-3">
                    {formData.specifications.map((spec, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <span className="font-medium">{spec.key}:</span>
                          <span className="ml-2">{spec.value}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveSpecification(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Chưa có thông số kỹ thuật</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={tempSpecKey}
                  onChange={(e) => setTempSpecKey(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên thông số (vd: Chất liệu)"
                />
                <div className="flex">
                  <input
                    type="text"
                    value={tempSpecValue}
                    onChange={(e) => setTempSpecValue(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Giá trị (vd: Cotton 100%)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Footer */}
        <div className="px-6 py-3 bg-gray-50 flex justify-end border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {submitLoading ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isEditMode ? 'Cập nhật' : 'Thêm sản phẩm'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
