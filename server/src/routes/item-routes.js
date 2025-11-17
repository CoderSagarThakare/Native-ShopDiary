// server/routes/itemRoutes.js
import express from 'express';
import {
  addItem,
  getItems,
  deleteItem,
}from '../controllers/item-controller.js';
import auth from '../middleware/auth-middleware.js'

const router = express.Router();

router.post('/', auth, addItem);
router.get('/', auth, getItems);
router.delete('/:id', auth, deleteItem);

export default router;
