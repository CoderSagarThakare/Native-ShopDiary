// server/controllers/entry-controller.js
import {Entry} from  "../models/entry-model.js";
import {
  deleteEntryService,
  getTodayEntriesService,
} from '../services/entry-service.js';

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

export const deleteEntry = async (req, res) => {
   
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log({ id, userId });

    const result = await deleteEntryService(id, userId);

    res.status(200).json({
      message: 'Entry deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to delete entry',
    });
  }
};

export const getTodayEntries = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;

    const entries = await getTodayEntriesService(userId, type);

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error in getTodayEntries controller:', error);
    res.status(500).json({ message: "Failed to fetch today's entries" });
  }
};