import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './models/Banner.js';
import Collection from './models/Collection.js';
import Product from './models/Product.js';
import { banners } from '../frontend/src/data/banners.js';
import { collections } from '../frontend/src/data/collections.js';
import { products } from '../frontend/src/data/products.js';
import Gift from './models/Gift.js';
import { men } from '../frontend/src/data/men.js';
import Men from './models/Men.js';

dotenv.config();

const gifts = [
  "/src/assets/images/products/U_BC_GIFTS_FOR_HER_10_AUGUST24_DII.webp",
  "/src/assets/images/products/louis-vuitton-my-monogram-fame-rectangle-sunglasses--Z2136U_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-khan-choang-monogram-shine--M75122_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-vong-tay-blooming--M1485A_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-carryall-bb--M13014_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-neverfull-bandouliere-inside-out-mm--M12096_PM2_Front view.png",
  "/src/assets/images/products/louis-vuitton-tui-diane--M45985_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-felicie-pochette--M14227_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-nuoc-hoa-spell-on-you--LP0212_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-khan-quang-reykjavik--M71040_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-onthego-mm--M45595_PM2_Front view.avif",
  "/src/assets/images/products/U_BC_GIFTS_FOR_HER_21_AUGUST24_DII.webp",
  "/src/assets/images/products/louis-vuitton-nuoc-hoa-ombre-nomade--LP0095_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-liv-pochette--M83301_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-nano-madeleine--M12144_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-tui-boulogne--M12930_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-vong-co-lv-floragram--M00981_PM2_Front view.avif",
  "/src/assets/images/products/louis-vuitton-vi-đung-ho-chieu--M63914_PM2_Front view.avif"
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function importAllData() {
  await mongoose.connect(MONGO_URI);

  // Import banners (chỉ 1 bản ghi, có thể update hoặc replace)
  // await Banner.deleteMany({});
  // await Banner.create(banners);
  // console.log('Đã import banners!');

  // // Import collections (nhiều bản ghi)
  // await Collection.deleteMany({});
  // await Collection.insertMany(collections);
  // console.log('Đã import collections!');

  // // Import products (nhiều bản ghi)
  // await Product.deleteMany({});
  // await Product.insertMany(products);
  // console.log('Đã import products!');

  // // Import gifts
  // await Gift.deleteMany({});
  // await Gift.insertMany(gifts.map(image => ({ image })));
  // console.log('Đã import gifts!');

  // await mongoose.disconnect();
  // console.log('Import tất cả dữ liệu thành công!');

  // Import men
  await Men.deleteMany({});
  await Men.insertMany(men);
  console.log('Đã import men!');
}


importAllData().catch(e => { console.error(e); process.exit(1); });
