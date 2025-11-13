// server/services/syncService.js
const Entry = require('../models/entry-model');

exports.syncOfflineEntries = async (userId, offlineEntries) => {
  const results = [];
  for (const entry of offlineEntries) {
    try {
      const newEntry = new Entry({ ...entry, userId });
      await newEntry.save();
      results.push({ success: true, entry: newEntry });
    } catch (err) {
      results.push({ success: false, error: err.message });
    }
  }
  return results;
};
