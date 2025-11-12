// src/screens/add-sale-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddSaleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Sale (Next)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a5d1a',
  },
});
