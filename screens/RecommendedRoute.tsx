import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RouteListStyles from '../styles/RouteListStyles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';

export default function RecommendedRoute() {
  const { origin, destination, setOrigin, setDestination } = useLocation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { plan } = route.params as { plan: any[] };

  const handleBack = () => {
    setOrigin(null);
    setDestination(null);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainScreen');
    }
  };

  if (!Array.isArray(plan) || plan.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No recommended route found</Text>
        <TouchableOpacity
          onPress={handleBack}
          style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color="blue" />
          <Text style={{ marginLeft: 8, color: 'black' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button */}
      <View
        style={{
          marginTop: 45,
          padding: 10,
          backgroundColor: '#f0f0f0',
          alignItems: 'flex-start',
        }}
      >
        <TouchableOpacity onPress={handleBack} style={RouteListStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={RouteListStyles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Show plan info for each ride */}
        {plan.map((step, idx) => (
          <View key={idx} style={{ marginTop: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {idx === 0 ? 'First Ride' : 'Transfer Ride'}: {step.name ?? 'Unnamed Route'}
            </Text>
            {step.originDistance !== undefined && (
              <Text>
                Origin distance:{' '}
                {typeof step.originDistance === 'number'
                  ? step.originDistance.toFixed(1) + ' m'
                  : 'N/A'}
              </Text>
            )}
            {step.destinationDistance !== undefined && (
              <Text>
                Destination distance:{' '}
                {typeof step.destinationDistance === 'number'
                  ? step.destinationDistance.toFixed(1) + ' m'
                  : 'N/A'}
              </Text>
            )}
          </View>
        ))}
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: origin?.latitude || 8.4542,
          longitude: origin?.longitude || 124.6319,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Origin marker */}
        {origin && <Marker coordinate={origin} title="Origin" pinColor="blue" />}
        {/* Destination marker */}
        {destination && <Marker coordinate={destination} title="Destination" pinColor="orange" />}

        {/* Draw polylines for each route in the plan */}
        {plan.map((step, idx) => {
          const coords =
            Array.isArray(step.route?.coordinates)
              ? step.route.coordinates.map(([lng, lat]: [number, number]) => ({
                  latitude: lat,
                  longitude: lng,
                }))
              : [];
          return (
            <Polyline
              key={idx}
              coordinates={coords}
              strokeColor={idx === 0 ? 'blue' : 'orange'}
              strokeWidth={3}
            />
          );
        })}
      </MapView>
    </View>
  );
}