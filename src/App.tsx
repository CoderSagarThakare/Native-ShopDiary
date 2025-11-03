// src/App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

import AppNavigator from './navigation/app-navigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    EncryptedStorage.getItem('user_token').then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);

  if (isLoggedIn === null) {
    return null; // Splash screen (add later)
  }

  return (
    <NavigationContainer>
      <AppNavigator
        isLoggedIn={isLoggedIn}
        onAuthChange={setIsLoggedIn}
      />
    </NavigationContainer>
  );
}