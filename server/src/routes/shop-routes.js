// server/src/routes/shop-routes.js
import express from 'express';
import { register } from '../controllers/shop-controller.js';

const router = express.Router();

router.post('/register', register);

export default router;