// src/screens/add-screen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDiaryStore } from '../store/diary-store';
import api from '../services/api-service';

const COMMON_ITEMS = [
  { label: 'Milk', value: 'milk', unit: 'L', price: 50 },
  { label: 'Biscuits', value: 'biscuits', unit: 'pkt', price: 30 },
  { label: 'Tea Leaves', value: 'tea', unit: 'kg', price: 300 },
  { label: 'Sugar', value: 'sugar', unit: 'kg', price: 45 },
  { label: 'Cigarettes', value: 'cigarettes', unit: 'pkt', price: 120 },
];

export default function AddScreen() {
  const [type, setType] = useState('buy'); // 'buy' or 'sale'
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [entries, setEntries] = useState([]);
  const { addToQueue } = useDiaryStore();

  // Load from encrypted storage
  useEffect(() => {
    loadEntries();
  }, [type]);

  const loadEntries = async () => {
    try {
      const key = type === 'buy' ? 'TODAY_BUYS' : 'TODAY_SALES';
      const data = await EncryptedStorage.getItem(key);
      setEntries(data ? JSON.parse(data) : []);
    } catch (e) {
      console.log('Load failed', e);
    }
  };

  const saveEntries = async newEntries => {
    try {
      const key = type === 'buy' ? 'TODAY_BUYS' : 'TODAY_SALES';
      await EncryptedStorage.setItem(key, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (e) {
      console.log('Local save failed', e);
    }
  };

  useEffect(() => {
    loadFromBackend();
  }, [type]);

  const loadFromBackend = async () => {
    try {
      const response = await api.get('/entries', {
        params: { type, date: new Date().toISOString().split('T')[0] },
      });
      setEntries(response.data);
    } catch (error) {
      // Fallback to local
      loadEntries();
    }
  };

  const addOrUpdateEntry = async () => {
    if (!item || !price || qty <= 0) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const priceNum = parseFloat(price);
    const total = priceNum * qty;

    const entryData = {
      item,
      price: priceNum,
      qty,
      total,
      unit: getUnit(item),
      type, // 'buy' or 'sale'
    };

    try {
      // 1. SEND TO BACKEND
      const response = await api.post('/entries', entryData);
      console.log('API Response:', response.data);
      const savedEntry = response.data;

      // 2. UPDATE LOCAL STATE
      const existing = entries.find(e => e.item === item);
      let updated;

      if (existing) {
        updated = entries.map(e =>
          e.item === item
            ? { ...e, qty: e.qty + qty, total: e.total + total }
            : e,
        );
      } else {
        updated = [...entries, { ...savedEntry, id: savedEntry._id }];
      }

      // 3. SAVE LOCALLY
      await saveEntries(updated);
      resetForm();

      Alert.alert('Success', `${item} saved!`);
    } catch (error) {
      console.log('API Error:', error.message);
      Alert.alert(
        'Failed',
        error.message.includes('internet')
          ? 'No internet. Please check connection and try again.'
          : 'Server error. Try again later.',
        [{ text: 'Retry', onPress: addOrUpdateEntry }],
      );
    }
  };

  const incrementQty = id => {
    const updated = entries.map(e =>
      e.id === id ? { ...e, qty: e.qty + 1, total: e.total + e.price } : e,
    );
    saveEntries(updated);
  };

  const getUnit = itemName => {
    const found = COMMON_ITEMS.find(i => i.label === itemName);
    return found?.unit || 'unit';
  };

  const resetForm = () => {
    setItem('');
    setPrice('');
    setQty(1);
  };

  const totalAmount = entries.reduce((sum, e) => sum + e.total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.tab, type === 'buy' && styles.activeTab]}
          onPress={() => setType('buy')}
        >
          <Text style={styles.tabText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, type === 'sale' && styles.activeTab]}
          onPress={() => setType('sale')}
        >
          <Text style={styles.tabText}>Sale</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* PICKER */}
        <View style={styles.picker}>
          <Picker
            selectedValue={item}
            onValueChange={setItem}
            style={{ color: '#333' }}
            dropdownIconColor="#227b22"
          >
            <Picker.Item label="Select or type item..." value="" />
            {COMMON_ITEMS.map(i => (
              <Picker.Item key={i.value} label={i.label} value={i.label} />
            ))}
          </Picker>
        </View>

        {/* PRICE + QTY ROW */}
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Price per unit (₹)"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
              <Text style={styles.qtyBtn}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)}>
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={addOrUpdateEntry}>
          <Text style={styles.saveText}>SAVE ENTRY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>TODAY'S {type.toUpperCase()}S</Text>
        <Text style={styles.total}>Total: ₹{totalAmount}</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.item}</Text>
            <Text style={styles.itemDetail}>
              {item.qty}
              {getUnit(item.item)} × ₹{item.price} = ₹{item.total}
            </Text>
            <TouchableOpacity onPress={() => incrementQty(item.id)}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No entries yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  toggle: { flexDirection: 'row', marginBottom: 16 },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#eee' },
  activeTab: { backgroundColor: '#227b22', borderRadius: 8 },
  tabText: { color: '#fff', fontWeight: '600' },
  form: {
    backgroundColor: '#ffffff', // White card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginRight: 12,
    color: '#333',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 50,
  },
  qtyBtn: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#227b22',
    width: 44,
    textAlign: 'center',
    paddingBottom: 4,
  },
  qty: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#227b22',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listTitle: { fontSize: 16, fontWeight: '600' },
  total: { fontSize: 16, fontWeight: 'bold', color: '#227b22' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  itemName: { fontWeight: '600', flex: 1 },
  itemDetail: { flex: 2, textAlign: 'right', marginRight: 8 },
  plus: { color: '#227b22', fontWeight: 'bold', fontSize: 20 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});
