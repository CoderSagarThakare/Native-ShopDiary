// server/src/services/auth-service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import Shop from '../models/shop-model.js';
import { createShopCollection } from '../utils/create-shop-collection.js';
import { createShopWithCollection } from './shop-service.js'; // ← STATIC IMPORT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async ({ shopName, email, password }) => {


    // 1. Check duplicates
    const shopExists = await Shop.findOne({ name: shopName });
    if (shopExists) throw new Error('Shop name already taken');

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('Email already registered');

    // // 2. Hash password
    const hashed = await bcrypt.hash(password, 12);

    console.log({ shopName })
    // // 3. Create shop
    console.log('Calling createShopWithCollection with:', shopName); // ← DEBUG
    const { shop, collectionName } = await createShopWithCollection(shopName);
    console.log('Shop created:', shop); // ← DEBUG

    // // 4. Create user
    const user = await User.create({
        email,
        password: hashed,
        shop: shop._id,
    });

    // // 5. Link owner
    shop.owner = user._id;
    await shop.save();

    // // 6. Create collection
    createShopCollection(collectionName);

    // // 7. Generate token
    const token = generateToken(user._id);

    return {
        token,
        user: { id: user._id, email: user.email, shopId: shop._id },
        message: 'Shop registered successfully',
    };

    return
};