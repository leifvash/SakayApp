import React from 'react';
import MapView from 'react-native-maps';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import markers from '../context/markers';
import mainscreen from '../styles/MainScreenStyles';
import MapOverlay from '../components/MapOverlay';

type Location = {
  id: string;
  name: string;
};

type MainScreenParams = {
  Main: {
    origin?: Location;
    destination?: Location;
  };
};


export default function MainScreen() {
  const route = useRoute<RouteProp<MainScreenParams, 'Main'>>();
  const origin = route.params?.origin;
  const destination = route.params?.destination;

  return (
    <View style={mainscreen.container}>
        <MapView 
            style={mainscreen.map}
            initialRegion={markers[0].coordinates}
        />
        <MapOverlay origin={origin} destination={destination}/>
    </View>
  );
}