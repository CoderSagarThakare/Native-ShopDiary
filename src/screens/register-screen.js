// src/screens/register-screen.js
import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import InputField from '../components/input-field';
import CommonButton from '../components/common-button';
import LoadingSpinner from '../components/loading-spinner';
import { registerShop } from '../services/auth-service';
import { validateEmail, validatePassword } from '../utils/validation';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_ERRORS = {
    email: '',
    shopName: '',
    password: '',
};

export default function RegisterScreen({ navigation, onAuth }) {
    const [form, setForm] = useState({
        email: 'saggythakare01@gmail.com',
        shopName: 'Tea Terminal',
        password: 'sagar@123',
    });
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const [loading, setLoading] = useState(false);

    const updateField = useCallback((field) => (value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' })); // Clear error on type
    }, []);

    const validate = useCallback(() => {
        const newErrors = { ...INITIAL_ERRORS };

        if (!form.shopName.trim()) {
            newErrors.shopName = 'Shop name is required';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(form.password)) {
            newErrors.password = 'Min 6 characters';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => !e);
    }, [form]);

    const handleRegister = useCallback(async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await registerShop(
                form.shopName.trim(),
                form.email.trim(),
                form.password
            );
            onAuth(true);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
        } finally {
            setLoading(false);
        }
    }, [form, validate, onAuth]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Your Shop</Text>
            <Text style={styles.subtitle}>Start tracking profit today</Text>

            <View style={styles.form}>
                <InputField
                    label="Email"
                    value={form.email}
                    onChangeText={updateField('email')}
                    placeholder="owner@shop.com"
                    keyboardType="email-address"
                    error={errors.email}

                />
                <InputField
                    label="Shop Name"
                    value={form.shopName}
                    onChangeText={updateField('shopName')}
                    placeholder="e.g., Chai Corner"
                    error={errors.shopName}
                />
                <InputField
                    label="Password"
                    value={form.password}
                    onChangeText={updateField('password')}
                    placeholder="Min 6 characters"
                    secureTextEntry
                    error={errors.password}
                />

                <CommonButton title="Register Shop" onPress={handleRegister} />
            </View>

            <Text style={styles.footer}>
                Already have a shop?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Login
                </Text>
            </Text>

            {loading && <LoadingSpinner message="Creating your shop..." />}
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
    error: {
        color: '#d32f2f',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
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