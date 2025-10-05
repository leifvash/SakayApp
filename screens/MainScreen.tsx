import React from 'react';
import MapView from 'react-native-maps';
import { View } from 'react-native';
import markers from '../context/markers';
import mainscreen from '../styles/MainScreenStyles';
import MapOverlay from '../components/MapOverlay';

export default function MainScreen() {
  return (
    <View style={mainscreen.container}>
        <MapView 
            style={mainscreen.map}
            initialRegion={markers[0].coordinates}
        />
        <MapOverlay/>
    </View>
  );
}