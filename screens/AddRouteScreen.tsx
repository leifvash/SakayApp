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
            // Parse coordinates into string array (lng,lat)
            const parsedCoords = coordinates
            .split(';')
            .map(coord => coord.trim())
            .filter(Boolean);

            const res = await fetch(`${API_URL}/routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                direction,
                district,
                coordinates: parsedCoords, // ✅ top-level
            }),
            });

            const data = await res.json();

            if (res.ok) {
            navigation.goBack();
            } else {
            setError(data.message || 'Failed to add route');
            }
        } catch (err: any) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Add New Route</Text>

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TextInput
        placeholder="Route Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Direction"
        value={direction}
        onChangeText={setDirection}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 15 }}
      />

      <TextInput
        placeholder="District"
        value={district}
        onChangeText={setDistrict}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Coordinates (lng,lat; lng,lat; ...)"
        value={coordinates}
        onChangeText={setCoordinates}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 20 }}
        multiline
      />

      <TouchableOpacity onPress={handleSave} style={{ backgroundColor: 'blue', padding: 15, borderRadius: 6 }} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Save Route</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}