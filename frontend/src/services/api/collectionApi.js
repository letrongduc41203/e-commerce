// Hàm gọi API lấy danh sách collections từ backend
export async function fetchCollections() {
  const response = await fetch('http://localhost:5000/api/collections');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
