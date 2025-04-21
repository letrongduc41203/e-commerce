import React from 'react';
import { Link } from 'react-router-dom';
// import { products } from '../data/products'; // Đã chuyển sang lấy từ API MongoDB


export function ProductGrid() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        import('../services/api/productApi').then(({ fetchProducts }) => {
            fetchProducts()
                .then(data => {
                    setProducts(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        });
    }, []);

    if (loading) return <div className="p-8">Đang tải sản phẩm...</div>;
    if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;
    if (!products.length) return <div className="p-8">Không có sản phẩm nào.</div>;

    return (
        <div className="p-8">
            <h2 className="text-center text-2xl font-bold mb-6">Khám phá các sáng tạo độc đáo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="p-4 flex flex-col items-center group hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="relative w-full">
                            <img
                                className="w-full h-80 object-cover"
                                src={product.thumbnail || product.image}
                                alt={product.title || product.name}
                            />
                            
                        </div>
                        <p className="mt-2 font-medium text-center">{product.title || product.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
} 
