// server/models/item-model.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, lowercase: true },
  unit: { type: String, required: true },
  defaultPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);

export { Item };
