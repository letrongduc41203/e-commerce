// Hàm gọi API lấy danh sách banners từ backend
export async function fetchBanners() {
  const response = await fetch('http://localhost:5000/api/banners');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
