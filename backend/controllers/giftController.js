import Gift from '../models/Gift.js';

// Lấy tất cả gifts
export const getGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({});
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};
