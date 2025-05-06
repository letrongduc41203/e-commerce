export async function fetchMen() {
    const response = await fetch('http://localhost:5000/api/men');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}
  