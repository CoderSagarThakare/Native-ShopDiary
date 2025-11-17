import api from "./api-service";
import API from '../constants/api';

export const loadUserItems = async () => {

  try {
    const res = await api.get(API.ITEM.GET_ITEMS_LIST);
    return res.data;
  } catch (err) {
    console.log('Failed to load items');
  }
};
