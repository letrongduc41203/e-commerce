import Men from '../models/Men.js';

export const getMen = async (req, res) => {
  try {
    const mens = await Men.find();
    res.json(mens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
