import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

export default function AddRouteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [direction, setDirection] = useState('');
  const [district, setDistrict] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Parse coordinates into array of [lng, lat]
      const parsedCoords = coordinates
        .split(';')
        .map(coord => coord.trim().split(',').map(Number))
        .filter(arr => arr.length === 2 && !arr.some(isNaN));

      const res = await fetch(`${API_URL}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          direction,
          district,
          route: { type: 'LineString', coordinates: parsedCoords },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.goBack();
      } else {
        setError(data.message || 'Failed to add route');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Add New Route</Text>

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TextInput placeholder="Route Name" value={name} onChangeText={setName}
        style={styles.input} />
      <TextInput placeholder="Direction" value={direction} onChangeText={setDirection}
        style={styles.input} />
      <TextInput placeholder="District" value={district} onChangeText={setDistrict}
        style={styles.input} />
      <TextInput
        placeholder="Coordinates (lng,lat; lng,lat; ...)"
        value={coordinates}
        onChangeText={setCoordinates}
        style={[styles.input, { marginBottom: 20 }]}
        multiline
      />

      <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: 'blue' }]} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text>Save Route</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 12, marginBottom: 15,
  },
  button: {
    padding: 15, borderRadius: 6,
  },
  buttonText: {
    color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600',
  },
};