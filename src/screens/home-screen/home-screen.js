// src/screens/home-screen/home-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Dashboard</Text>
      <Text style={styles.subtitle}>Today's Profit: ₹850</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a5d1a' },
  subtitle: { fontSize: 18, color: '#666', marginTop: 10 },
});
