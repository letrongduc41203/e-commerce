import Banner from '../models/Banner.js';

// Lấy tất cả banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners[0] || {}); // Lấy bản ghi đầu tiên (giả định có 1 bản ghi)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy banners' });
  }
};
