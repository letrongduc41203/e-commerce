import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchCollections } from '../services/api/collectionApi';

const Collections = () => {
    const { season } = useParams();

    // Lấy collection từ API MongoDB dựa vào slug (season)
    const [collection, setCollection] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        fetchCollections()
            .then(data => {
                const found = data.find(c => c.slug === season);
                setCollection(found);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [season]);

    if (loading) return <div className="container mx-auto px-4 py-8">Đang tải bộ sưu tập...</div>;
    if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Lỗi: {error}</div>;
    if (!collection) {
        return <div className="container mx-auto px-4 py-8">Không tìm thấy bộ sưu tập</div>;
    }

    return (
        <div className="w-full mt-16 mb-10">
            {/* Banner Section */}
            <div className="relative w-full h-auto mb-8">
                <img
                    src={collection.banner}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 flex items-end h-full w-full">
                    <div className="rounded-lg px-6 py-4 text-left w-1/4 min-w-[180px] ml-8 mb-8">
                        <h1 className="text-xl font-bold text-white leading-tight mb-5">
                            {collection.name}
                        </h1>
                        <p className="text-sm text-white">
                            {collection.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}

            <div className="w-full px-0">
                {/* Thêm 2 hàng sản phẩm, không trùng dữ liệu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-4">
                    {collection.products.slice(4, 12).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-4">
                    {collection.products.slice(12, 20).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Cột trái: ảnh lớn */}
                    <div className="w-full h-full">
                        <img
                            src={collection.modelImage}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Cột phải: sản phẩm chia 2x2 */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-0">
                        {collection.products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Collections; 