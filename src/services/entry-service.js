import api from "./api-service";
import API from '../constants/api';
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

export const loadEntriesFromServer = async (type = 'buy') => {
  try {
    const { start, end } = getTodayDateRange();

    const res = await api.get(API.ENTRY.GET_TODAYS, {
      params: {
        type,
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

    return res.data
  } catch (err) {
    console.log('Server sync failed, using offline data', err.message);
    throw err;
  }
};
