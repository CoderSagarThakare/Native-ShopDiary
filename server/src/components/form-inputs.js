// src/components/FormInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function FormInput({
  value,
  onChange,
  placeholder,
  keyboardType,
}) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
