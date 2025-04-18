import React from 'react';

const GridLayout = ({ gifts }) => {
  return (
    <div className="w-full grid grid-cols-6 grid-rows-10 gap-2">
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className={`text-white flex items-center justify-center p-4 text-xl font-bold bg-gray-50 rounded-2xl
            ${[
              "col-span-2 row-span-3", // div1
              "row-span-2 col-start-3", // div2
              "row-span-2 col-start-4", // div3
              "col-span-2 row-span-3 col-start-3 row-start-3", // div4
              "col-span-2 row-span-3 col-start-5 row-start-1", // div5
              "row-span-2 row-start-4", // div6
              "row-span-2 row-start-4", // div7
              "row-span-2 col-start-5 row-start-4", // div8
              "row-span-2 col-start-6 row-start-4", // div9
              "row-span-2 col-start-3 row-start-6", // div10
              "row-span-2 col-start-4 row-start-6", // div11
              "col-span-2 row-span-3 col-start-1 row-start-6", // div12
              "col-span-2 row-span-3 col-start-5 row-start-6", // div13
              "col-span-2 row-span-3 col-start-3 row-start-8", // div14
              "row-span-2 row-start-9", // div15
              "row-span-2 row-start-9", // div16
              "row-span-2 col-start-5 row-start-9", // div17
              "row-span-2 col-start-6 row-start-9" // div18
            ][i]}`}
        >
          {gifts[i] && (
            <img src={gifts[i].image} alt={`Grid item ${i + 1}`} className="w-auto h-auto object-contain rounded-2xl" />
          )}
        </div>
      ))}
    </div>
  );
};

export function Gifts() {
  const [gifts, setGifts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    import('../services/api/giftApi').then(({ fetchGifts }) => {
      fetchGifts()
        .then(data => {
          setGifts(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/src/assets/images/banner/COMMERCIAL_GIFT_GUIDE_ALWAYS_ON_07_LVCOM_1920x1080_DI3.avif" // Thay đổi đường dẫn hình ảnh tại đây
            alt="Quà tặng Louis Vuitton"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Grid Layout Section */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div>Đang tải quà tặng...</div>
        ) : error ? (
          <div className="text-red-500">Lỗi: {error}</div>
        ) : (
          <GridLayout gifts={gifts} />
        )}
      </div>
    </div>
  );
}

export default Gifts;
