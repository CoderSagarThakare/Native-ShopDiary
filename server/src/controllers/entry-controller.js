// server/controllers/entryController.js
import {Entry} from  "../models/entry-model.js";

export const addEntry = async (req, res) => {
  try {
    const { item, price, qty, unit, type } = req.body;
    const total = price * qty;

    const entry = new Entry({
      userId: req.user.id,
      type, // 'buy' or 'sale'
      item,
      price,
      qty,
      total,
      unit,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const { type, date } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (date) filter.date = { $gte: new Date(date) };

    const entries = await Entry.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
