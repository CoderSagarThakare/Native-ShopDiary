// src/components/common-button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function CommonButton({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity
      style={[styles.btn, variant === 'danger' && styles.danger]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  danger: { backgroundColor: '#d32f2f' },
  text: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});