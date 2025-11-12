// src/navigation/bottom-tab-navigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/home-screen';
import AddScreen from '../screens/add-screen';
import HistoryScreen from '../screens/history-screen';
import SettingsScreen from '../screens/settings-screen';
import AddBuyScreen from '../screens/add-buy-screen';
import AddSaleScreen from '../screens/add-screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Nested Navigator for Add Tab
// function AddNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="AddMain" component={AddScreen} />
//       <Stack.Screen name="AddBuy" component={AddBuyScreen} />
//       <Stack.Screen name="AddSale" component={AddSaleScreen} />
//     </Stack.Navigator>
//   );
// }

export default function BottomTabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a5d1a',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: { paddingBottom: 5, height: 60, backgroundColor: '#fff' },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {props => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen
        name="Add"
        component={AddSaleScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
