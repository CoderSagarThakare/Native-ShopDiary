// // src/navigation/bottom-tab-navigator.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import HomeScreen from '../screens/home-screen/home-screen';
// import AddScreen from '../screens/add-screen/add-screen';
// import HistoryScreen from '../screens/history-screen/history-screen';
// import SettingsScreen from '../screens/settings-screen/settings-screen';

// const Tab = createBottomTabNavigator();

// export default function BottomTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#07ee07ff',
//         tabBarInactiveTintColor: '#0b66eeff',
//         tabBarLabelStyle: {
//           fontWeight: '600',
//         },
//         tabBarStyle: { paddingBottom: 5, height: 60 },
//         headerShown: false,
//         lazy: true, // Lazy load for performance
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Add"
//         component={AddScreen}
//         options={{
//           tabBarLabel: 'Add',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="add-circle" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="History"
//         component={HistoryScreen}
//         options={{
//           tabBarLabel: 'History',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="history" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarLabel: 'Settings',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="settings" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
