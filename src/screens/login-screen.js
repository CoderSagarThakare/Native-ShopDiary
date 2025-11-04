// src/screens/login-screen.js
import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/input-field';
import CommonButton from '../components/common-button';
import LoadingSpinner from '../components/loading-spinner';
import { loginShop } from '../services/auth-service';
import { validateEmail, validatePassword } from '../utils/validation';

export default function LoginScreen({ navigation, onAuth }) {
  const [form, setForm] = useState({
    email: 'saggythakare01@gmail.com',
    password: 'sagar@123',
  });
  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validate = () => {
    if (!form.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!validateEmail(form.email)) {
      Alert.alert('Error', 'Invalid email');
      return false;
    }
    if (!form.password) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    if (!validatePassword(form.password)) {
      Alert.alert('Error', 'Password too short');
      return false;
    }
    return true;
  };

  const handleLogin = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await loginShop(form.email.trim(), form.password);
      onAuth(true);
    } catch (err) {
      console.log(err)
      const msg = err.response?.data?.message || 'Login failed. Try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  }, [form, onAuth]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your shop</Text>

      <View style={styles.form}>
        <InputField
          label="Email"
          value={form.email}
          onChangeText={updateField('email')}
          placeholder="owner@shop.com"
          keyboardType="email-address"
        />
        <InputField
          label="Password"
          value={form.password}
          onChangeText={updateField('password')}
          placeholder="Enter password"
          secureTextEntry
        />

        <CommonButton title="Login" onPress={handleLogin} />
      </View>

      <Text style={styles.footer}>
        Don't have a shop?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>

      {loading && <LoadingSpinner message="Logging in..." />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a5d1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
  },
  link: {
    color: '#1a5d1a',
    fontWeight: 'bold',
  },
});