// server/src/controllers/shop-controller.js
import { registerUser } from '../services/auth-service.js';

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.message.includes('taken') || err.message.includes('registered') ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};