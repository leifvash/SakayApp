import React from 'react';
import MapView, { Marker, UrlTile, Polyline, MapPressEvent, PROVIDER_DEFAULT } from 'react-native-maps';
import { ViewStyle } from 'react-native';

// Coordinate type
export type Coordinate = {
  latitude: number;
  longitude: number;
};

// Marker type
type MarkerType = {
  id: string;
  coordinates: Coordinate;
  name: string;
};

// Polyline type
type PolylineType = {
  id: string;
  coordinates: Coordinate[];
  color: string;
};

// Props for CustomMap
type CustomMapProps = {
  style?: ViewStyle;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: MarkerType[];       // optional
  polylines?: PolylineType[];   // optional
  onPress?: (event: MapPressEvent) => void; // optional
};

export default function CustomMap({
  style,
  initialRegion,
  markers = [],
  polylines = [],
  onPress,
}: CustomMapProps) {
  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
      provider={PROVIDER_DEFAULT}
      onPress={onPress}
    >
      {/* ✅ Use a proper tile provider (MapTiler, Geoapify, etc.) */}
      <UrlTile
        key="maptiler-tiles"
        urlTemplate="https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}@2x.png?key=AxTYFa385wq5rF5Ybzbk"
        maximumZ={19}
        tileSize={512}   // sharper tiles on modern devices
      />

      {/* ✅ Render markers safely */}
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={m.coordinates}
          title={m.name}
        />
      ))}

      {/* ✅ Render polylines safely */}
      {polylines.map((p) => (
        <Polyline
          key={p.id}
          coordinates={p.coordinates}
          strokeColor={p.color}
          strokeWidth={3}
        />
      ))}
    </MapView>
  );
}