// server/routes/entryRoutes.js
import express from 'express';
import { addEntry ,getEntries} from '../controllers/entry-controller.js';
import auth from '../middleware/auth-middleware.js'

const router = express.Router();

router.post('/', auth, addEntry);
router.get('/', auth, getEntries);

export default router;
