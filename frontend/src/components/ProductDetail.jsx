import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import { collections } from "../data/collections"; // Đã chuyển sang lấy từ API MongoDB

const sections = [
  { title: "Phát triển bền vững", content: "Nội dung phát triển bền vững..." },
  { title: "Chăm sóc sản phẩm", content: "Nội dung chăm sóc sản phẩm..." },
  { title: "Dịch vụ tại cửa hàng", content: "Nội dung dịch vụ tại cửa hàng..." },
  { title: "Chính sách giao hàng và đổi hàng", content: "Nội dung chính sách giao hàng và đổi hàng..." },
  { title: "Nghệ thuật tặng quà", content: "Nội dung nghệ thuật tặng quà..." },
];

export default function ProductDetail({ addToCart }) {
  const [showMore, setShowMore] = useState(false);
  const { id } = useParams();
  const [openSection, setOpenSection] = useState(null);

  // Lấy sản phẩm từ API MongoDB
  const [product, setProduct] = useState(null);
  const [collectionName, setCollectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Lấy tất cả collections, tìm sản phẩm theo id
    fetch('http://localhost:5000/api/collections')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        let found = null, name = '';
        for (const collection of data) {
          found = (collection.products || []).find((p) => String(p.id) === String(id));
          if (found) {
            name = collection.name;
            break;
          }
        }
        setProduct(found);
        setCollectionName(name);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Đang tải sản phẩm...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;
  if (!product) {
    return <div className="p-8 text-red-500">Không tìm thấy sản phẩm!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Left: Product Image */}
      <div className="md:w-1/2 w-full h-[500px] md:h-auto bg-gradient-to-br from-gray-200 to-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right: Product Info */}
      <div className="md:w-1/2 w-full bg-white flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-xs text-gray-400 mb-2">{collectionName}</div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <div className="text-sm text-gray-500 mb-2">ID sản phẩm: <span className="font-mono">{id}</span></div>
          <div className="text-lg font-bold mb-4">{product.price.toLocaleString('vi-VN')} ₫</div>
          <button
            className="w-full bg-black text-white py-3 rounded mb-6 hover:bg-gray-800 transition"
            onClick={() => addToCart(product)}
          >
            Thêm vào giỏ hàng
          </button>
          <p className="text-sm mb-2">
            {/* Nếu có description thì hiển thị, không thì mô tả mặc định */}
            {product.description || `Sản phẩm thuộc bộ sưu tập ${collectionName}.`}
            <span
              className="text-blue-700 underline cursor-pointer ml-2 select-none"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? 'Thu gọn' : 'Xem thêm'}
            </span>
          </p>
          {/* Hiện mô tả chi tiết khi showMore = true */}
          <div
            className={`overflow-hidden transition-all duration-500 ${showMore ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
          >
            <div className="rounded p-4 text-sm">
              {product.longDescription || "Không có mô tả chi tiết"}
            </div>
          </div>
          {/* Collapsible Sections */}
          <div className="divide-y border-t mt-4">
            {sections.map((section, idx) => (
              <div key={idx}>
                <button
                  className="w-full flex justify-between items-center py-3 text-left"
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <span>{section.title}</span>
                  <span>{openSection === idx ? "−" : "+"}</span>
                </button>
                {openSection === idx && (
                  <div className="text-sm text-gray-500 pb-3">{section.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}