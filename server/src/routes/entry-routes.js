// server/routes/entryRoutes.js
const express = require('express');
const { addEntry, getEntries } = require('../controllers/entryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, addEntry);
router.get('/', auth, getEntries);

module.exports = router;
