// src/services/syncService.js
import api from './api-service';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDiaryStore } from '../store/diary-store';

const SYNC_QUEUE_KEY = 'SYNC_QUEUE';

export const queueForSync = async (entry, type) => {
  try {
    const queue = await getSyncQueue();
    queue.push({ ...entry, type, timestamp: Date.now() });
    await EncryptedStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    triggerSync();
  } catch (e) {
    console.log('Queue failed', e);
  }
};

export const triggerSync = async () => {
  const { setSyncPending } = useDiaryStore.getState();
  const queue = await getSyncQueue();
  if (queue.length === 0) return;

  setSyncPending(queue.length);

  for (const item of queue) {
    try {
      await api.post('/entries', item);
      removeFromQueue(item.timestamp);
    } catch (err) {
      console.log('Sync failed, retry later', err);
      break; // Stop on failure
    }
  }

  const remaining = await getSyncQueue();
  setSyncPending(remaining.length);
};

const getSyncQueue = async () => {
  const data = await EncryptedStorage.getItem(SYNC_QUEUE_KEY);
  return data ? JSON.parse(data) : [];
};

const removeFromQueue = async timestamp => {
  const queue = await getSyncQueue();
  const updated = queue.filter(i => i.timestamp !== timestamp);
  await EncryptedStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
};
