import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  X, 
  MoreHorizontal,
  Eye
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filtering
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
  });
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Selected products for bulk actions
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch products with pagination, sorting, filtering, and search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }
        
        // Build query params
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', limit);
        params.append('sortField', sortField);
        params.append('sortOrder', sortOrder);
        
        // Add filters
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.inStock) params.append('inStock', filters.inStock);
        
        // Add search term
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await axios.get(`${API_URL}/products?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, limit, sortField, sortOrder, filters, searchTerm]);

  // Handle sort change
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
    });
    setSearchTerm('');
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by useEffect
  };
  
  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Toggle select product
  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Toggle select all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };
  
  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productId)
      );
      
      // Clear from selected products
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };
  
  // Bulk delete products
  const bulkDeleteProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      await axios.post(`${API_URL}/products/bulk-delete`, {
        productIds: selectedProducts
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.filter(product => !selectedProducts.includes(product._id))
      );
      
      // Clear selected products
      setSelectedProducts([]);
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error bulk deleting products:', err);
      alert('Không thể xóa hàng loạt sản phẩm. Vui lòng thử lại sau.');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg font-medium">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-white rounded-md shadow hover:shadow-md"
          >
            <RefreshCw size={16} className="mr-2" />
            <span>Làm mới</span>
          </button>
          
          <Link
            to="/admin/products/add"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={16} className="mr-2" />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text"
                placeholder="Tìm theo tên sản phẩm, mã sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
            </form>
          </div>
          
          {/* Filter toggle */}
          <div className="flex gap-2">
            <button 
              onClick={toggleFilter}
              className={`flex items-center px-4 py-2 rounded-md ${
                isFilterOpen ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={18} className="mr-2" />
              <span>Bộ lọc</span>
            </button>
            
            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
              >
                <X size={18} className="mr-2" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="Shirts">Áo</option>
                  <option value="Pants">Quần</option>
                  <option value="Shoes">Giày</option>
                  <option value="Accessories">Phụ kiện</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá từ
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VND"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá đến
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VND"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tình trạng kho
                </label>
                <select
                  name="inStock"
                  value={filters.inStock}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="true">Còn hàng</option>
                  <option value="false">Hết hàng</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-blue-600 font-medium">
              Đã chọn {selectedProducts.length} sản phẩm
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setConfirmDelete('bulk')}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Xóa đã chọn
            </button>
            
            <button
              onClick={() => setSelectedProducts([])}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Danh mục
                    {sortField === 'category' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Giá
                    {sortField === 'price' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('countInStock')}
                >
                  <div className="flex items-center">
                    Kho
                    {sortField === 'countInStock' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelectProduct(product._id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={product.image} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.countInStock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        ({product.countInStock})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/products/${product.slug}`}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                          title="Xem"
                        >
                          <Eye size={16} />
                        </Link>
                        
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-1.5 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <button
                          onClick={() => setConfirmDelete(product._id)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <select
                    className="mx-1 border border-gray-300 rounded"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  {' '}mục trên mỗi trang
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-1 border rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa</h3>
            <p className="mb-6 text-gray-600">
              {confirmDelete === 'bulk'
                ? `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn không? Hành động này không thể hoàn tác.`
                : 'Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (confirmDelete === 'bulk') {
                    bulkDeleteProducts();
                  } else {
                    deleteProduct(confirmDelete);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
