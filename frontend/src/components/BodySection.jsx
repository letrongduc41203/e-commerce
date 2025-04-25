import React from "react";
import { Link } from "react-router-dom";

export function BodySection() {
  const [bodyBanners, setBodyBanners] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    import('../services/api/bannerApi').then(({ fetchBanners }) => {
      fetchBanners()
        .then(data => {
          setBodyBanners(data.body || []);
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
  if (!bodyBanners.length) return <div className="p-8">Không có banner</div>;

  const firstRow = bodyBanners.slice(0, 2);
  const secondRow = bodyBanners.slice(2, 4);

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
        {firstRow.map((banner) => (
          <div key={banner.id} className="relative h-[600px] md:h-[800px] lg:h-[1000px]">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <h3 className="absolute w-full bottom-16 text-white text-2xl md:text-3xl font-semibold mb-6 drop-shadow-lg text-center">{banner.title}</h3>
            <div className="absolute bottom-12 w-full flex justify-center">
              <Link
                to={banner.buttonLink}
                className="border border-white text-white px-20 py-2 text-xs tracking-wider font-medium rounded-full hover:bg-white hover:text-black transition-all duration-200"
              >
                {banner.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      {secondRow.length > 0 && (
        <div className="w-full grid grid-cols-1">
          {secondRow.map((banner) => (
            <div key={banner.id} className="relative h-[600px] md:h-[800px] lg:h-[1000px]">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <h3 className="absolute w-full bottom-16 text-white text-2xl md:text-3xl font-semibold mb-6 drop-shadow-lg text-center">{banner.title}</h3>
              <div className="absolute bottom-12 w-full flex justify-center">
                <Link
                  to={banner.buttonLink}
                  className="border border-white text-white px-20 py-2 text-xs tracking-wider font-medium rounded-full hover:bg-white hover:text-black transition-all duration-200"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
