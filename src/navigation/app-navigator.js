// src/navigation/app-navigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/login-screen';
import BottomTabs from './bottom-tabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, onAuthChange }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main">
          {props => (
            <BottomTabs {...props} onLogout={() => onAuthChange(false)} />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Login">
          {props => (
            <LoginScreen {...props} onLogin={() => onAuthChange(true)} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
