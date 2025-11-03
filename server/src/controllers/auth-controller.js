// src/controllers/auth-controller.js
import User from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { shopName, password } = req.body;

  if (!shopName || !password) {
    return res.status(400).json({ message: 'Shop name and password required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be 6+ chars' });
  }

  try {
    const exists = await User.findOne({ shopName });
    if (exists) return res.status(400).json({ message: 'Shop already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ shopName, password: hashed });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, shopName: user.shopName },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { shopName, password } = req.body;

  if (!shopName || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const user = await User.findOne({ shopName });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, shopName: user.shopName },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};