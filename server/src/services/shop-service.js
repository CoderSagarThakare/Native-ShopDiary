// server/src/services/shop-service.js
import Shop from '../models/shop-model.js';

export const createShopWithCollection = async (shopName) => {
  console.log({shopName})
  const collectionName = `shop_${shopName.toLowerCase().replace(/\s+/g, '_')}`;

  const shop = await Shop.create({
    name: shopName,
    collectionName,
  });

  return { shop, collectionName };
};