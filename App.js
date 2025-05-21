// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import Xchange from './screens/xchange';
// Placeholder screens for future expansion
const Wishlist = () => null;
const Account = () => null;

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Xchange') iconName = 'home-outline';
            else if (route.name === 'Wishlist') iconName = 'heart-outline';
            else if (route.name === 'Account') iconName = 'person-outline';

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: '#0a7',
          tabBarInactiveTintColor: '#888',
        })}
      >
        <Tab.Screen name="Xchange" component={Xchange} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
