// server/controllers/entryController.js
const Entry = require('../models/Entry');

exports.addEntry = async (req, res) => {
  try {
    const entry = new Entry({ ...req.body, userId: req.user.id });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEntries = async (req, res) => {
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
