import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import routeListStyles from '../styles/RouteListStyles';
import RouteMapScreenStyles from '../styles/RouteMapScreenStyles';
import RouteDetailsOverlay from '../components/RouteDetailsOverlay';
import { ActivityIndicator } from 'react-native';

// Type for individual coordinates
type Coordinate = {
  latitude: number;
  longitude: number;
};

// Type for full route data fetched from backend
type RouteData = {
  name: string;
  mode: string;
  fare?: number;
  stops?: string[]; // Optional array of stop names
  coordinates: Coordinate[]; // Array of lat/lng points
};

// Navigation parameter type for RouteMap screen
type RouteMapParams = { routeId: string };

// Full stack param list for navigation typing
type RootStackParamList = {
  RouteList: { mode: 'jeepney' | 'tricycle' };
  RouteMap: { routeId: string };
};

export default function RouteMapScreen() {
  // Navigation and route hooks with type safety
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<Record<string, RouteMapParams>, string>>();
  const { routeId } = route.params;

  // Local state to hold fetched route data
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  // Fetch route details from backend when routeId changes
  useEffect(() => {
    fetch(`http://192.168.1.3:3000/routes/${routeId}`)
      .then((res) => res.json())
      .then((data) => {
        // Defensive check: ensure coordinates exist and are valid
        if (!data.coordinates || !Array.isArray(data.coordinates)) {
          console.error('Invalid or missing coordinates:', data);
          return;
        }

        // Parse coordinates into proper lat/lng format
        const parsedCoords = data.coordinates.map((c: any) => ({
          latitude: parseFloat(c.latitude),
          longitude: parseFloat(c.longitude),
        }));

        // Store route data in state
        setRouteData({ ...data, coordinates: parsedCoords });
      });
  }, [routeId]);

  // Show loading spinner while data is being fetched
  if (!routeData) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const coordinates = routeData.coordinates;

  return (
    <View style={RouteMapScreenStyles.container}>
      {/* MapView to display route path and stops */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 8.4800,
          longitude: coordinates[0]?.longitude || 124.6400,
          latitudeDelta: 0.1,
          longitudeDelta: 0.01,
        }}
      >
        {/* Render markers for each coordinate, using stop names if available */}
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={coord}
            title={routeData.stops?.[index] ?? `Stop ${index + 1}`}
          />
        ))}

        {/* Draw polyline connecting all coordinates */}
        <Polyline coordinates={coordinates} strokeColor="#FF5733" strokeWidth={4} />
      </MapView>

      {/* Back button to return to previous screen */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={RouteMapScreenStyles.backButton}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      {/* Overlay component to show route details like name, fare, stops */}
      <RouteDetailsOverlay
        name={routeData.name}
        mode={routeData.mode}
        fare={routeData.fare}
        stops={routeData.stops}
      />
    </View>
  );
}