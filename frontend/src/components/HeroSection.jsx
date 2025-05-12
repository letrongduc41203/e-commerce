import React from 'react';
import { Link } from 'react-router-dom';

export function HeroSection() {
    const [hero, setHero] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        import('../services/api/bannerApi').then(({ fetchBanners }) => {
            fetchBanners()
                .then(data => {
                    setHero(data.hero);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        });
    }, []);

    if (loading) return <div className="h-[500px] flex items-center justify-center">Đang tải...</div>;
    if (error) return <div className="h-[500px] flex items-center justify-center text-red-500">Lỗi: {error}</div>;
    if (!hero) return null;

    return (
        <div className="relative h-[500px] md:h-[600px] lg:h-[1200px]">
            <div className="w-screen h-full -mx-[calc((100vw-100%)/2)]">
                <img
                    className="w-full h-full object-cover" 
                    src={hero.image}
                    alt={hero.title}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4">{hero.title}</h2>
                    <Link
                        to={hero.buttonLink}
                        className="mt-6 w-[90%] md:w-[420px] py-4 flex items-center justify-center rounded-full border border-white text-white bg-[rgba(255,255,255,0.07)] font-semibold text-lg tracking-wide shadow-lg backdrop-blur-sm hover:bg-[rgba(255,255,255,0.15)] transition-all duration-200"
                        style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}
                    >
                        {hero.buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
}

