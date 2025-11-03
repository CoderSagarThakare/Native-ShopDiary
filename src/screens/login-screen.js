// src/screens/login-screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CommonButton from '../components/common-button';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function LoginScreen({ onLogin }) {
  const handleLogin = async () => {
    try {
      await EncryptedStorage.setItem('user_token', 'shop-diary-jwt');
      onLogin(); // This triggers re-render with Home
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Diary</Text>
      <Text style={styles.tagline}>Track buys, sales & profit daily</Text>
      <CommonButton title="Login (Demo)" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#1a5d1a', marginBottom: 10 },
  tagline: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
});