import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Xchange from './screens/xchange';
import ItemDetails from './screens/itemdetails';
import LoginScreen from './screens/loginscreen';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Xchange"
        component={Xchange}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={{ title: 'Item Details' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
