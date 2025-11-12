// src/navigation/bottom-tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/home-screen';
import AddBuyScreen from '../screens/add-buy-screen';
import AddSaleScreen from '../screens/add-sale-screen';
import ReportsScreen from '../screens/reports-screen';

const Tab = createBottomTabNavigator();

export default function BottomTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a5d1a',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      >
        {props => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen
        name="AddBuy"
        component={AddBuyScreen}
        options={{
          tabBarLabel: 'Buy',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="AddSale"
        component={AddSaleScreen}
        options={{
          tabBarLabel: 'Sale',
          tabBarIcon: ({ color, size }) => (
            <Icon name="attach-money" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
