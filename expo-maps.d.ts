declare module 'expo-maps' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapViewProps extends ViewProps {
    provider?: 'osm' | 'google';
    initialRegion?: Region;
    style?: any;
  }

  export default class MapView extends React.Component<MapViewProps> {}
}