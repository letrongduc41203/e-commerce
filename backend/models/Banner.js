import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  hero: {
    title: String,
    description: String,
    image: String,
    buttonText: String,
    buttonLink: String
  },
  featured: [
    {
      id: Number,
      image: String
    }
  ],

  body: [
    {
      id: Number,
      image: String,
      title: String,
      buttonText: String,
      buttonLink: String
    }
  ]
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
