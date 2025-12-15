import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationProvider } from './context/LocationContext';

import StartScreen from './screens/StartScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AddRouteScreen from './screens/AddRouteScreen';
import EditRouteScreen from './screens/EditRouteScreen';
import MainScreen from './screens/MainScreen';
import RouteListScreen from './screens/RouteListScreen';
import RouteMapScreen from './screens/RouteMapScreen';
import MapPicker from './screens/MapPicker';
import RecommendedRoute from './screens/RecommendedRoute';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
          {/* Entry point */}
          <Stack.Screen name="StartScreen" component={StartScreen} />

          {/* Admin flow */}
          <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} />
          <Stack.Screen name="RouteList" component={RouteListScreen} />
          <Stack.Screen name="AddRoute" component={AddRouteScreen} />
          <Stack.Screen name="EditRoute" component={EditRouteScreen} />
          <Stack.Screen name="RouteMap" component={RouteMapScreen} />
          {/* Later you can add AddRoute / EditRoute screens here */}

          {/* User flow */}
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="MapPicker" component={MapPicker} />
          <Stack.Screen name="RecommendedRoute" component={RecommendedRoute} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}