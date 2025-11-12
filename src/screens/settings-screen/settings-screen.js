// src/screens/settings-screen/settings-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Shop Profile & Logout</Text>
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
