// src/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth-routes.js';
import shopRoutes from './routes/shop-routes.js';
import entriesRoutes from './routes/entry-routes.js';
import itemRoutes from './routes/item-routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/items',itemRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));