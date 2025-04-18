// Hàm gọi API lấy danh sách gifts từ backend
export async function fetchGifts() {
  const response = await fetch('http://localhost:5000/api/gifts');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
