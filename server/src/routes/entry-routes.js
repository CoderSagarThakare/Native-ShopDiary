// server/routes/entryRoutes.js
import express from 'express';
import {
  addEntry,
  getEntries,
  deleteEntry,
  getTodayEntries
} from '../controllers/entry-controller.js';
import auth from '../middleware/auth-middleware.js'

const router = express.Router();

router.post('/', auth, addEntry);
router.get('/', auth, getEntries);
router.delete('/:id', auth, deleteEntry);
router.get('/today', auth,getTodayEntries );

export default router;
