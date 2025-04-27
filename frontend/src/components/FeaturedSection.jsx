import React from 'react';
// import { banners } from '../data/banners'; // Đã chuyển sang lấy từ API MongoDB

export function FeaturedSection() {
    const [featured, setFeatured] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        import('../services/api/bannerApi').then(({ fetchBanners }) => {
            fetchBanners()
                .then(data => {
                    setFeatured(data.featured || []);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        });
    }, []);

    if (loading) return <div className="p-8">Đang tải...</div>;
    if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;
    if (!featured.length) return null;

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((item) => (
                    <div key={item.id} className="cursor-pointer">
                        <img 
                            className="w-full h-full object-cover" 
                            src={item.image}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
} 