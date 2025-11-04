// src/services/auth-service.js
import api from './api-service';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native';

export const registerShop = async (shopName, email, password) => {
    try {
        const res = await api.post('/auth/register', {
            shopName: shopName.trim(),
            password,
            email
        });
        console.log({ res })

        // Success: Save token
        await EncryptedStorage.setItem('user_token', res.data.token);
        console.log('Registered & token saved');
        return res.status === 201;

    } catch (error) {
        // NETWORK / SERVER ERROR
        if (error.code === 'ERR_NETWORK' || !error.response) {
            Alert.alert('No Internet', 'Check your connection and try again.');
            console.log('Network error:', error.message);
            return false;
        }

        // SERVER ERROR (400, 500)
        const msg = error.response?.data?.message || 'Registration failed';
        Alert.alert('Error', msg);
        console.log('Server error:', msg);
        throw error;
    }
};

export const loginShop = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    await EncryptedStorage.setItem('user_token', res.data.token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
    await EncryptedStorage.removeItem('user_token');
};