// server/models/Entry.js
import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sale'], required: true },
  item: { type: String, required: true ,lowercase: true,},
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  unit: String,
  date: { type: Date, default: Date.now },
});

const Entry = mongoose.model('Entry', entrySchema);

export { Entry };