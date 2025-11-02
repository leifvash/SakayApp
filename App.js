import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationProvider } from './context/LocationContext'

import MainScreen from './screens/MainScreen';
import RouteListScreen from './screens/RouteListScreen';
import LocationSearchScreen from './screens/LocationSearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LocationProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="RouteList" component={RouteListScreen} />
          <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}