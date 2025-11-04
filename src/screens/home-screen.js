// src/screens/home-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDiaryStore } from '../store/diary-store';
import StatCard from '../components/stat-card';
import CommonButton from '../components/common-button';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation, onLogout }) {
  const { todaySales, todayBuys, syncPending } = useDiaryStore();
  const profit = todaySales - todayBuys;

  const logout = async () => {
    await EncryptedStorage.removeItem('user_token');
    onLogout(); // Triggers re-render with Login
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shop Diary</Text>
      <Text style={styles.subtitle}>Daily Profit Tracker</Text>

      <StatCard label="Today's Sales" amount={todaySales} />
      <StatCard label="Today's Buys" amount={todayBuys} />
      <StatCard
        label="Profit"
        amount={profit}
        type={profit >= 0 ? 'profit' : 'loss'}
      />

      {syncPending > 0 && (
        <Text style={styles.sync}>Sync pending: {syncPending} items</Text>
      )}

      <View style={styles.row}>
        <CommonButton title="+ Buy" onPress={() => navigation.navigate('AddBuy')} />
        <CommonButton title="+ Sale" onPress={() => navigation.navigate('AddSale')} />
      </View>

      <View style={{ marginTop: 30 }}>
        <CommonButton title="Logout" onPress={logout} variant="danger" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1a5d1a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  sync: { textAlign: 'center', color: '#ff9800', marginBottom: 10 },
});