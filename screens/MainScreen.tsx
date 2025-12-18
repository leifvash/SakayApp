import React from 'react';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import markers from '../context/markers';
import mainscreen from '../styles/MainScreenStyles';
import MapOverlay from '../components/MainScreenMapOverlay';

type Location = { id: string; name: string };
type MainScreenParams = { Main: { origin?: Location; destination?: Location } };

export default function MainScreen() {
  const route = useRoute<RouteProp<MainScreenParams, 'Main'>>();
  const origin = route.params?.origin;
  const destination = route.params?.destination;

  return (
    <View style={mainscreen.container}>
      <MapView
        style={mainscreen.map}
        initialRegion={{
          latitude: markers[0].coordinates.latitude,
          longitude: markers[0].coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* OSM tiles */}
        <UrlTile
          key="maptiler-tiles"
          urlTemplate="https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=AxTYFa385wq5rF5Ybzbk"
          maximumZ={19}
        />
      </MapView>
      <MapOverlay />
    </View>
  );
}