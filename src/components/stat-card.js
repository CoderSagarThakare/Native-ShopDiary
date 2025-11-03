// src/components/stat-card.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function StatCard({ label, amount, type = 'default' }) {
  const isProfit = type === 'profit';
  const isLoss = type === 'loss';

  return (
    <View
      style={[
        styles.card,
        isProfit && styles.profitBg,
        isLoss && styles.lossBg,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.amount,
          isProfit && styles.profitText,
          isLoss && styles.lossText,
        ]}
      >
        ₹{Math.abs(amount)} {isProfit && 'Up'} {isLoss && 'Down'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  profitBg: { backgroundColor: theme.success },
  lossBg: { backgroundColor: theme.danger },
  label: { fontSize: 16, color: '#444' },
  amount: { fontSize: 28, fontWeight: 'bold', color: theme.primary, marginTop: 4 },
  profitText: { color: theme.primary },
  lossText: { color: '#d32f2f' },
});