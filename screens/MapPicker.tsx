import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../context/LocationContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { API_URL } from '@env';

export default function MapPicker() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { type } = route.params as { type: 'origin' | 'destination' };

  const { origin, destination, setOrigin, setDestination } = useLocation();
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
  };

  const handleSave = async () => {
    if (!selectedCoord) return;

    if (type === 'origin') {
      setOrigin(selectedCoord);
    } else {
      setDestination(selectedCoord);
    }

    const finalOrigin = type === 'origin' ? selectedCoord : origin;
    const finalDestination = type === 'destination' ? selectedCoord : destination;

    if (finalOrigin && finalDestination) {
      try {
        const response = await fetch(`${API_URL}/routes/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: { lat: finalOrigin.latitude, lng: finalOrigin.longitude },
            destination: { lat: finalDestination.latitude, lng: finalDestination.longitude },
            thresholdMeters: 200
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.plan) && data.plan.length > 0) {
            navigation.navigate('RecommendedRoute', { plan: data.plan });
          } else {
            navigation.navigate('RecommendedRoute', { plan: [], error: data.error || 'No route found' });
          }
        } else {
          navigation.navigate('RecommendedRoute', { plan: [], error: 'No route found' });
        }
      } catch (err) {
        navigation.navigate('RecommendedRoute', { plan: [], error: 'Network error. Please try again.' });
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Back Button Header */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
          Select {type === 'origin' ? 'Origin' : 'Destination'}
        </Text>
      </TouchableOpacity>

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 8.4542,
          longitude: 124.6319,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedCoord && <Marker coordinate={selectedCoord} />}
      </MapView>

      {/* Save Button */}
      <TouchableOpacity style={{ padding: 16, backgroundColor: 'blue' }} onPress={handleSave}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Save {type}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}