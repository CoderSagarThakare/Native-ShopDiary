// src/navigation/app-navigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

import LoginScreen from '../screens/login-screen';
import HomeScreen from '../screens/home-screen';
import AddBuyScreen from '../screens/add-buy-screen';
import AddSaleScreen from '../screens/add-sale-screen';
import RegisterScreen from "../screens/register-screen"

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, onAuthChange }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Home">
                        {(props) => <HomeScreen {...props} onLogout={() => onAuthChange(false)} />}
                    </Stack.Screen>
                    <Stack.Screen name="AddBuy" component={AddBuyScreen} />
                    <Stack.Screen name="AddSale" component={AddSaleScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Register">
                        {(props) => <RegisterScreen {...props} onAuth={onAuthChange} />}
                    </Stack.Screen>
                    <Stack.Screen name="Login">
                        {(props) => <LoginScreen {...props} onAuth={onAuthChange} />}
                    </Stack.Screen>
                </>
            )}
        </Stack.Navigator>
    );
}