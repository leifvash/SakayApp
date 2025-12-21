import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../context/LocationContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import CustomMap from '../components/CustomMap';

export default function MapPicker() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { type } = route.params as { type: 'origin' | 'destination' };

  const { setOrigin, setDestination } = useLocation();
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
  };

  const handleSave = () => {
    if (!selectedCoord) {
      console.log("⚠️ No coordinate selected");
      return;
    }

    if (type === "origin") {
      setOrigin(selectedCoord);
    } else {
      setDestination(selectedCoord);
    }

    navigation.goBack();
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

      {/* Map with tap handler */}
      <CustomMap
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 8.4542,
          longitude: 124.6319,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        markers={
          selectedCoord
            ? [{ id: 'selected', coordinates: selectedCoord, name: 'Selected Point' }]
            : []
        }
        onPress={handleMapPress}   // ✅ capture taps
      />

      {/* Save Button */}
      <TouchableOpacity style={{ padding: 16, backgroundColor: 'blue' }} onPress={handleSave}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Save {type}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}