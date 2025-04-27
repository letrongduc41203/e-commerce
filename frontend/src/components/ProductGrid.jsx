import React from 'react';
import { Link } from 'react-router-dom';
// import { products } from '../data/products'; // Đã chuyển sang lấy từ API MongoDB


export function ProductGrid() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [centerIndex, setCenterIndex] = React.useState(1);

    React.useEffect(() => {
        import('../services/api/productApi').then(({ fetchProducts }) => {
            fetchProducts()
                .then(data => {
                    console.log('data from API:', data);
                    setProducts(data.products); // hoặc data.data, tùy vào cấu trúc thực tế
                    setLoading(false);
                    setCenterIndex(data.products && data.products.length > 1 ? 1 : 0);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        });
    }, []);

    if (loading) return <div className="p-8">Đang tải sản phẩm...</div>;
    if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;
    console.log('products:', products);
    if (!products.length) return <div className="p-8">Không có sản phẩm nào.</div>;

    // Tính toán 3 sản phẩm hiển thị: trước, giữa, sau
    let visibleProducts = [];
    if (products.length === 1) {
        visibleProducts = [products[0]];
    } else if (products.length === 2) {
        visibleProducts = [products[0], products[1]];
    } else if (products.length > 2) {
        const prev = (centerIndex - 1 + products.length) % products.length;
        const next = (centerIndex + 1) % products.length;
        visibleProducts = [products[prev], products[centerIndex], products[next]];
    }

    const handlePrev = () => {
        setCenterIndex((prev) => (prev - 1 + products.length) % products.length);
    };
    const handleNext = () => {
        setCenterIndex((prev) => (prev + 1) % products.length);
    };

    return (
        <div className="p-8 mt-10">
            <div className="flex justify-center items-center gap-4 select-none">
                <button
                    aria-label="Prev"
                    onClick={handlePrev}
                    className="text-2xl md:text-3xl px-2 py-1 rounded-full hover:bg-gray-100 transition mr-20"
                >
                    &#8592;
                </button>
                {/* Carousel core */}
                <div className="flex items-center gap-4 w-full max-w-5xl justify-center">
                    {visibleProducts.map((product, idx) => {
                        let translate = '';
                        let opacity = 'opacity-100';
                        if (idx === 0) {
                            translate = '-translate-x-8';
                            opacity = 'opacity-60';
                        } else if (idx === 2) {
                            translate = 'translate-x-8';
                            opacity = 'opacity-60';
                        }
                        return (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className={`flex flex-col items-center w-[180px] md:w-[260px] lg:w-[340px] transition-all duration-500 ${translate} ${opacity} ${idx === 1 ? 'z-10 shadow-xl' : ''}`}
                                style={{ pointerEvents: idx === 1 ? 'auto' : 'none' }}
                            >
                                <div className="relative w-full aspect-square rounded overflow-hidden">
                                    <img
                                        className="w-full h-full"
                                        src={product.thumbnail || product.image}
                                        alt={product.title || product.name}
                                    />
                                </div>
                                {idx === 1 && (
                                    <p className="font-semibold text-center text-sm md:text-base lg:text-lg tracking-wide mt-6">
                                        {product.title || product.name}
                                    </p>
                                )}
                            </Link>
                        );
                    })}
                </div>
                <button
                    aria-label="Next"
                    onClick={handleNext}
                    className="text-2xl md:text-3xl px-2 py-1 rounded-full hover:bg-gray-100 transition ml-20"
                >
                    &#8594;
                </button>
            </div>
            {/* Indicator */}
            <div className="flex justify-center mt-20 gap-2">
                {products.map((_, idx) => (
                    <span
                        key={idx}
                        className={`inline-block w-10 h-1 rounded transition-all duration-200 ${idx === centerIndex ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );

} 
