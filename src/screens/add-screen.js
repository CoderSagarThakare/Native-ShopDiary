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
      addToQueue(); // Offline sync
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const addOrUpdateEntry = () => {
    if (!item || !price || qty <= 0) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }

    const total = parseFloat(price) * qty;
    const newEntry = {
      id: Date.now().toString(),
      item,
      price: parseFloat(price),
      qty,
      total,
      unit: getUnit(item),
    };

    const existing = entries.find(e => e.item === item);
    let updated;

    if (existing) {
      updated = entries.map(e =>
        e.item === item
          ? { ...e, qty: e.qty + qty, total: e.total + total }
          : e,
      );
    } else {
      updated = [...entries, newEntry];
    }

    saveEntries(updated);
    resetForm();
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
        <Picker
          selectedValue={item}
          onValueChange={setItem}
          style={styles.picker}
        >
          <Picker.Item label="Select Item" value="" />
          {COMMON_ITEMS.map(i => (
            <Picker.Item key={i.value} label={i.label} value={i.label} />
          ))}
        </Picker>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Price per unit"
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

        <TouchableOpacity style={styles.saveBtn} onPress={addOrUpdateEntry}>
          <Text style={styles.saveText}>SAVE</Text>
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
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  picker: { height: 50, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { fontSize: 24, width: 40, textAlign: 'center', color: '#227b22' },
  qty: { width: 40, textAlign: 'center', fontSize: 18 },
  saveBtn: {
    backgroundColor: '#227b22',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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
