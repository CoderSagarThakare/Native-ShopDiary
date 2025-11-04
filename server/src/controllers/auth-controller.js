// src/controllers/auth-controller.js
import User from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginUser } from '../services/auth-service.js';
import { registerUser } from '../services/auth-service.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.message.includes('taken') || err.message.includes('registered') ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.send(result);
  } catch (err) {
    const status = err.message.includes('Invalid') ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};