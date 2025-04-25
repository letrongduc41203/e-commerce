import React from "react";

const bannerImage = "https://via.placeholder.com/1200x500?text=Banner";
const bigImage = "https://via.placeholder.com/800x600?text=Big+Model";
const products = [
  {
    id: 1,
    title: "Product 1",
    image: "https://via.placeholder.com/400x400?text=Product+1"
  },
  {
    id: 2,
    title: "Product 2",
    image: "https://via.placeholder.com/400x400?text=Product+2"
  },
  {
    id: 3,
    title: "Product 3",
    image: "https://via.placeholder.com/400x400?text=Product+3"
  },
  {
    id: 4,
    title: "Product 4",
    image: "https://via.placeholder.com/400x400?text=Product+4"
  },
  {
    id: 5,
    title: "Product 5",
    image: "https://via.placeholder.com/400x400?text=Product+5"
  },
  {
    id: 6,
    title: "Product 6",
    image: "https://via.placeholder.com/400x400?text=Product+6"
  },
  {
    id: 7,
    title: "Product 7",
    image: "https://via.placeholder.com/400x400?text=Product+7"
  },
  {
    id: 8,
    title: "Product 8",
    image: "https://via.placeholder.com/400x400?text=Product+8"
  },
  {
    id: 9,
    title: "Product 9",
    image: "https://via.placeholder.com/400x400?text=Product+9"
  },
  {
    id: 10,
    title: "Product 10",
    image: "https://via.placeholder.com/400x400?text=Product+10"
  },
  {
    id: 11,
    title: "Product 11",
    image: "https://via.placeholder.com/400x400?text=Product+11"
  },
  {
    id: 12,
    title: "Product 12",
    image: "https://via.placeholder.com/400x400?text=Product+12"
  },
  {
    id: 13,
    title: "Product 13",
    image: "https://via.placeholder.com/400x400?text=Product+13"
  },
  {
    id: 14,
    title: "Product 14",
    image: "https://via.placeholder.com/400x400?text=Product+14"
  },
  {
    id: 15,
    title: "Product 15",
    image: "https://via.placeholder.com/400x400?text=Product+15"
  },
  {
    id: 16,
    title: "Product 16",
    image: "https://via.placeholder.com/400x400?text=Product+16"
  }
];

export default function NewArrHer() {
  return (
    <div className="bg-white">
      {/* Banner lớn đầu trang */}
      <div className="relative w-full h-[400px] md:h-[520px] lg:h-[600px]">
        <img
          src={bannerImage}
          alt="New Arrivals for Women"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          <h1 className="text-white text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg">
            New Arrivals for Women
          </h1>
          <p className="text-white text-base md:text-lg mb-4 drop-shadow">
            A seasonal selection of new ready-to-wear and accessories for Spring/Summer 2025.
          </p>
          <button className="px-8 py-2 rounded-full bg-white text-black font-medium hover:bg-black hover:text-white transition">
            Discover now
          </button>
        </div>
      </div>

      {/* Grid sản phẩm */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-8">
        {/* Dòng sản phẩm đầu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((prod) => (
            <div key={prod.id} className="bg-white rounded shadow hover:shadow-lg transition p-3">
              <img src={prod.image} alt={prod.title} className="w-full aspect-square object-cover rounded" />
              <div className="mt-2 text-center">
                <p className="font-medium">{prod.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ảnh lớn xen giữa */}
        <div className="w-full mb-8">
          <img src={bigImage} alt="Big model" className="w-full object-cover rounded-lg" />
        </div>

        {/* Grid sản phẩm tiếp theo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(8, 16).map((prod) => (
            <div key={prod.id} className="bg-white rounded shadow hover:shadow-lg transition p-3">
              <img src={prod.image} alt={prod.title} className="w-full aspect-square object-cover rounded" />
              <div className="mt-2 text-center">
                <p className="font-medium">{prod.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}