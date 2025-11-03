// src/store/diary-store.js
import { create } from 'zustand';

export const useDiaryStore = create((set) => ({
  todaySales: 0,
  todayBuys: 0,
  syncPending: 0,
  setSales: (amount) => set({ todaySales: amount }),
  setBuys: (amount) => set({ todayBuys: amount }),
  addToQueue: () => set((state) => ({ syncPending: state.syncPending + 1 })),
}));