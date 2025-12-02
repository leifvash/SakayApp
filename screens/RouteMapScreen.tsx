import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RouteMapScreenStyles from '../styles/RouteMapScreenStyles';
import RouteDetailsOverlay from '../components/RouteDetailsOverlay';
import { API_URL } from '@env';

// Type for individual coordinates
type Coordinate = {
  latitude: number;
  longitude: number;
};

// Type for full route data fetched from backend
type RouteData = {
  name: string;
  fare?: number;
  stops?: string[];
  route: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  coordinates: Coordinate[]; // parsed lat/lng for MapView
};

// Navigation parameter type for RouteMap screen
type RouteMapParams = { routeId: string };
type RootStackParamList = { RouteMap: RouteMapParams };

export default function RouteMapScreen() {
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<Record<string, RouteMapParams>, string>>();
  const { routeId } = route.params;

  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const res = await fetch(`${API_URL}/routes/${routeId}`);
        const data = await res.json();

        if (!data.route?.coordinates || !Array.isArray(data.route.coordinates)) {
          console.error('❌ Invalid or missing coordinates:', data);
          return;
        }

        const parsedCoords = data.route.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteData({ ...data, coordinates: parsedCoords });
      } catch (err: any) {
        console.error('❌ Fetch error:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [routeId]);

  if (loading || !routeData) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const coordinates = routeData.coordinates;

  return (
    <View style={RouteMapScreenStyles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 8.4800,
          longitude: coordinates[0]?.longitude || 124.6400,
          latitudeDelta: 0.1,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={coordinates} strokeColor="#FF5733" strokeWidth={4} />
      </MapView>

      <TouchableOpacity onPress={() => navigation.goBack()} style={RouteMapScreenStyles.backButton}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <RouteDetailsOverlay
        name={routeData.name}
        fare={routeData.fare}
        stops={routeData.stops}
      />
    </View>
  );
}