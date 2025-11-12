// server/models/Entry.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sale'], required: true },
  item: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  unit: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entry', entrySchema);
