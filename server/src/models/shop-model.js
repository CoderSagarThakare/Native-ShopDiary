// server/src/models/shop-model.js
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Shop name is required'], 
    trim: true,
    unique: true 
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectionName: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Shop', shopSchema); // ← MUST BE 'Shop'