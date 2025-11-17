import { Entry } from '../models/entry-model.js';

export const deleteEntryService = async (entryId, userId) => {
  const deleted = await Entry.findOneAndDelete({
    _id: entryId,
    userId: userId,
  });

  if (!deleted) {
    const error = new Error('Entry not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  return { id: entryId };
};

const getTodayDateRange = () => {
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getTodayEntriesService = async (userId, type = null) => {
  try {
    const { start, end } = getTodayDateRange();

    const filter = {
      userId,
      date: { $gte: start, $lte: end },
    };

    if (type && ['buy', 'sale'].includes(type)) {
      filter.type = type;
    }

    const entries = await Entry.find(filter).sort({ date: -1 }).lean();

    return entries;
  } catch (error) {
    console.error('Service Error - getTodayEntries:', error);
    throw error;
  }
};

