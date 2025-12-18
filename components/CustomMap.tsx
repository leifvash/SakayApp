// components/CustomMap.tsx
import React from 'react';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';

type MarkerType = {
  id: string;
  name?: string;
  coordinates: { latitude: number; longitude: number };
  color?: string;
};

interface Props {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: MarkerType[];
  polylines?: { id: string; coordinates: { latitude: number; longitude: number }[]; color?: string }[];
  style?: any;
}

export default function CustomMap({ initialRegion, markers = [], polylines = [], style }: Props) {
  return (
    <MapView style={style} initialRegion={initialRegion}>
      {/* ✅ Geoapify tiles */}
      <UrlTile
        key="maptiler-tiles"
        urlTemplate="https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=AxTYFa385wq5rF5Ybzbk"
        maximumZ={19}
      />

      {/* ✅ Markers */}
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={m.coordinates}
          title={m.name}
          pinColor={m.color || 'red'}
        />
      ))}

      {/* ✅ Polylines */}
      {polylines.map((p) => (
        <Polyline
          key={p.id}
          coordinates={p.coordinates}
          strokeColor={p.color || 'blue'}
          strokeWidth={3}
        />
      ))}
    </MapView>
  );
}