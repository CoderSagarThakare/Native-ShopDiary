/* eslint-disable react-native/no-inline-styles */
// src/screens/add-screen.js (UPDATED)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import api from '../services/api-service';
import API from '../constants/api.js';
import { SwipeListView } from 'react-native-swipe-list-view';
import { loadEntriesFromServer } from '../services/entry-service';
import { loadUserItems } from '../services/item-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default function AddScreen() {
  const [type, setType] = useState('buy');
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [entries, setEntries] = useState([]);
  const [userItems, setUserItems] = useState([]);
  // const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('');

  const loadEntryAndItems = async () => {
    loadEntries();
    setUserItems(await loadUserItems());
  };
  useEffect(() => {
    loadEntryAndItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const loadEntries = async () => {
    try {
      const key = type === 'buy' ? 'TODAY_BUYS' : 'TODAY_SALES';

      const serverEntries = await loadEntriesFromServer(type);

      await EncryptedStorage.setItem(key, JSON.stringify(serverEntries));
      setEntries(serverEntries);
    } catch (err) {
      console.log('Failed to load from Entries server', err);
    }
  };

  // const loadEntriesFromServer = async () => {
  //   try {
  //     const res = await api.get('/entries', { params: { type } });
  //     const serverEntries = res.data.map(e => ({
  //       id: e._id,
  //       item: e.item,
  //       price: e.price,
  //       qty: e.qty,
  //       total: e.total,
  //       unit: e.unit,
  //     }));
  //     setEntries(serverEntries);
  //     await saveEntries(serverEntries);
  //   } catch (err) {
  //     console.log('Failed to load entries from server', err);
  //   }
  // };

  // const loadUserItems = async () => {
  //   try {
  //     const res = await api.get(API.ITEM.GET_ITEMS_LIST);
  //     console.log('User items loaded', res.data);
  //     setUserItems(res.data);
  //   } catch (err) {
  //     console.log('Failed to load items');
  //   }
  // };

  const saveEntries = async newEntries => {
    const key = type === 'buy' ? 'TODAY_BUYS' : 'TODAY_SALES';
    await EncryptedStorage.setItem(key, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addOrUpdateEntry = async () => {
    if (!item || !price || !qty || parseFloat(qty) <= 0) {
      return Alert.alert('Error', 'Fill all fields');
    }

    const priceNum = parseFloat(price);
    const qtyNum = parseFloat(qty);
    const total = priceNum * qtyNum;
    const unit = getUnit(item);

    const entryData = { item, price: priceNum, qty, total, unit, type };

    try {
      const res = await api.post(API.ENTRY.ENTRY, entryData);
      const saved = res.data;

      const existing = entries.find(e => e.item === item);
      let updated;

      if (existing) {
        updated = entries.map(e =>
          e.item === item
            ? { ...e, qty: e.qty + qty, total: e.total + total }
            : e,
        );
      } else {
        updated = [...entries, { ...saved, id: saved._id }];
      }

      await saveEntries(updated);
      resetForm();
      Alert.alert('Success', `${item} saved!`);
    } catch (err) {
      console.log('Error while save entry', err);
    }
  };

  const addNewItem = async () => {
    if (!newItemName || !newItemUnit || !defaultPrice) {
      return Alert.alert('Error', 'All fields are mandatory');
    }

    const cleanedName = newItemName.trim().toLowerCase();

    const alreadyExists = userItems.some(
      item => item.name.toLowerCase() === cleanedName,
    );

    if (alreadyExists) {
      return Alert.alert(
        'Already Added',
        `"${newItemName}" is already in your items.`,
      );
    }

    try {
      const res = await api.post(API.ITEM.GET_ITEMS_LIST, {
        name: newItemName,
        unit: newItemUnit,
        defaultPrice: parseFloat(defaultPrice) || 0,
      });

      setUserItems([...userItems, res.data]);
      setItem(newItemName);
      // setShowAddItem(false);
      setNewItemName('');
      setNewItemUnit('');
      setDefaultPrice('');
      Alert.alert('Success', `${newItemName} added to your items!`);
    } catch (err) {
      Alert.alert('Failed', 'Try again');
    }
  };

  const getUnit = name => {
    const found = [...userItems].find(i => i.label === name || i.name === name);
    return found?.unit || 'unit';
  };

  const resetForm = () => {
    setItem('');
    setPrice('');
    setQty(1);
  };

  const deleteEntry = async id => {
    try {
      await api.delete(`${API.ENTRY.ENTRY}/${id}`);

      const updated = entries.filter(e => e._id !== id);
      await saveEntries(updated);
      Alert.alert('Deleted', 'Entry removed');
    } catch (err) {
      console.log('Failed to delete from server', err);
    }
  };

  const allItems = [...userItems.map(i => ({ label: i.name, value: i.name }))];

  return (
    <View style={styles.container}>
      {/* Toggle */}
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

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.picker}>
          <Picker
            selectedValue={item}
            onValueChange={value => {
              setItem(value);
              if (value && value !== 'ADD_NEW') {
                const found = [...userItems].find(
                  i => (i.label || i.name) === value,
                );
                if (found && found.defaultPrice > 0) {
                  setPrice(found.defaultPrice.toString());
                } else {
                  setPrice('');
                }
                setQty('1');
              }
            }}
            style={{ color: '#333', minWidth: '100%' }}
          >
            <Picker.Item label="Select item..." value="" />
            <Picker.Item label="+ Add New Item" value="ADD_NEW" />
            {allItems.map((i, idx) => (
              <Picker.Item key={idx} label={i.label} value={i.label} />
            ))}
          </Picker>
        </View>

        {item === 'ADD_NEW' && (
          <View style={styles.addItemForm}>
            <TextInput
              placeholder="Item name"
              value={newItemName}
              onChangeText={setNewItemName}
              style={styles.input}
              placeholderTextColor="#333"
            />
            <TextInput
              placeholder="Unit (L,pkt,kg,box,pc,dozen...)"
              value={newItemUnit}
              onChangeText={setNewItemUnit}
              style={styles.input}
              placeholderTextColor="#333"
            />
            <TextInput
              placeholder="Default Price"
              value={defaultPrice}
              onChangeText={setDefaultPrice}
              style={styles.input}
              placeholderTextColor="#333"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={addNewItem}>
              <Text style={styles.saveText}>ADD ITEM</Text>
            </TouchableOpacity>
          </View>
        )}

        {item && item !== 'ADD_NEW' && (
          <>
            {/* PRICE + QTY ROW */}
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.prevItemInput]}
                placeholder="Price per unit"
                value={price}
                onChangeText={text => {
                  // Allow decimal
                  if (text === '' || /^\d*\.?\d*$/.test(text)) {
                    setPrice(text);
                  }
                }}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => {
                    const num = parseFloat(qty) || 0;
                    setQty((num - 0.5).toFixed(2));
                  }}
                >
                  <Text style={styles.qtyBtn}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.qty, { textAlign: 'center' }]}
                  value={qty}
                  onChangeText={text => {
                    if (text === '' || /^\d*\.?\d*$/.test(text)) {
                      setQty(text);
                    }
                  }}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity
                  onPress={() => {
                    const num = parseFloat(qty) || 0;
                    setQty((num + 0.5).toFixed(2));
                  }}
                >
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={addOrUpdateEntry}>
              <Text style={styles.saveText}>SAVE ENTRY</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* List */}
      <SwipeListView
        data={entries}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.item}</Text>
              <Text style={styles.itemDetail}>
                {item.qty}
                {getUnit(item.item)} × ₹{item.price} = ₹{item.total}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => {
                const updated = entries.map(e =>
                  e.id === item.id
                    ? { ...e, qty: e.qty + 1, total: e.total + e.price }
                    : e,
                );
                saveEntries(updated);
              }}
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteEntry(item._id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        disableRightSwipe={true}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* Real basket / shopping bag icon */}
            <MaterialIcons
              name={type === 'buy' ? 'shopping-basket' : 'point-of-sale'}
              size={90}
              color="#dc7272ff"
              style={{ marginBottom: 24, opacity: 0.8 }}
            />

            <Text style={styles.emptyTitle}>
              {type === 'buy' ? 'No purchases today' : 'No sales recorded yet'}
            </Text>

            <Text style={styles.emptySubtitle}>
              select item & <Text style={styles.highlight}>SAVE ENTRY</Text> to
              start tracking
            </Text>

            <View style={styles.emptyFooter}>
              <MaterialIcons name="lock-outline" size={16} color="#666" />
              <Text style={styles.emptyHint}>
                Your data is encrypted and private.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },

  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },

  // Toggle buttons
  toggle: { flexDirection: 'row', marginBottom: 16 },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  activeTab: { backgroundColor: '#227b22', borderRadius: 8 },
  tabText: { color: '#fff', fontWeight: '600' },

  // Form Card
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // PICKER — CRITICAL FIX
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    height: 56,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#227b22',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: '#227b22',
    marginBottom: 12,
  },
  prevItemInput: {
    marginBottom: 0,
    paddingHorizontal: 8,
    minWidth: '48%',
  },

  // Add Item Form
  addItemForm: {
    marginTop: 10,
  },

  // Qty Row
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    height: 56,
    borderWidth: 0.5,
    borderColor: '#227b22',
  },
  qtyBtn: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#227b22',
    width: 50,
    textAlign: 'center',
  },
  qty: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  // Buttons
  saveBtn: {
    backgroundColor: '#227b22',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 5,
    marginTop: 8,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },

  // List
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#227b22',
    minHeight: 56,
  },
  itemInfo: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  itemDetail: {
    color: '#227b22',
    fontWeight: '600',
    fontSize: 15,
    flex: 2,
    textAlign: 'right',
    marginRight: 12,
  },
  plus: {
    color: '#227b22',
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: 26,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    borderRadius: 12,
    marginBottom: 10,
    padding: 2,
  },

  deleteBtn: {
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    borderRadius: 12,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },

  highlight: {
    color: '#227b22',
    fontWeight: 'bold',
  },

  emptyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  emptyHint: {
    fontSize: 13,
    color: '#888',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});
