// server/controllers/items-controller.js
import {Item} from '../models/item-model.js';
export const addItem = async (req, res) => {
  try {
    const { name, unit, defaultPrice } = req.body;
    const item = new Item({ userId: req.user.id, name, unit, defaultPrice });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};