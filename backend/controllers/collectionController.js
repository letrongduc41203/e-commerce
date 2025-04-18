import Collection from '../models/Collection.js';

// Lấy tất cả collections
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy collections' });
  }
};
