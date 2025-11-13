// src/App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/app-navigator';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    EncryptedStorage.getItem('user_token').then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);


  if (isLoggedIn === null) {
    return null; // Splash screen (will add later)
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator
          isLoggedIn={isLoggedIn}
          onAuthChange={setIsLoggedIn}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}