import React from 'react';
import MapView, { UrlTile, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
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

  const initialLat = markers[0]?.coordinates.latitude ?? 8.48;
  const initialLon = markers[0]?.coordinates.longitude ?? 124.65;

  return (
    <View style={mainscreen.container}>
      <MapView
        style={mainscreen.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Pure Maptiler tiles */}
        <UrlTile
          key="maptiler-tiles"
          urlTemplate="https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}@2x.png?key=AxTYFa385wq5rF5Ybzbk"
          maximumZ={20}
        />
      </MapView>

      <MapOverlay/>
    </View>
  );
}