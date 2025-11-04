// server/src/services/auth-service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import Shop from '../models/shop-model.js';
import { createShopCollection } from '../utils/create-shop-collection.js';
import { createShopWithCollection } from './shop-service.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async ({ shopName, email, password }) => {

    const shopExists = await Shop.findOne({ name: shopName });
    if (shopExists) throw new Error('Shop name already taken');

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 12);

    console.log({ shopName })
    const { shop, collectionName } = await createShopWithCollection(shopName);

    const user = await User.create({
        email,
        password: hashed,
        shop: shop._id,
    });

    shop.owner = user._id;
    await shop.save();

    createShopCollection(collectionName);

    const token = generateToken(user._id);

    return {
        token,
        user: { id: user._id, email: user.email, shopId: shop._id },
        message: 'Shop registered successfully',
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).populate('shop');
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            shopId: user.shop._id,
            shopSlug: user.shop.slug,
        },
        message: 'Login successful',
    };
};