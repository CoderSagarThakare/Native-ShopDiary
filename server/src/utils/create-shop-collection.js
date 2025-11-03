// server/src/utils/create-shop-collection.js
import mongoose from 'mongoose';

export const createShopCollection = (shopName) => {
  const collectionName = `shop_${shopName.toLowerCase().replace(/\s+/g, '_')}`;
  
  const entrySchema = new mongoose.Schema({
    type: { type: String, enum: ['buy', 'sale'], required: true },
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
        total: Number,
      },
    ],
    totalAmount: Number,
    date: { type: Date, default: Date.now },
  });

  return mongoose.model(collectionName, entrySchema, collectionName);
};