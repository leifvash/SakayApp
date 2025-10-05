import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './screens/MainScreen';
import RouteListScreen from './screens/RouteListScreen';
// import RouteMapScreen from './screens/RouteMapScreen'; // create this if needed

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="RouteList" component={RouteListScreen} />
        {/* <Stack.Screen name="RouteMap" component={RouteMapScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}