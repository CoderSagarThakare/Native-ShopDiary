// src/screens/add-screen/add-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Add</Text>
      <Text style={styles.subtitle}>Add Buy or Sale Here</Text>
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
