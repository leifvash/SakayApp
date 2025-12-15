import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

export default function EditRouteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { route: routeData } = route.params as {
    route: { id: string; name: string; direction: string; district?: string; coordinates?: string[] };
  };

  const [name, setName] = useState(routeData.name);
  const [direction, setDirection] = useState(routeData.direction);
  const [district, setDistrict] = useState(routeData.district ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/routes/${routeData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          direction,
          district,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.goBack();
      } else {
        setError(data.message || 'Failed to update route');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/routes/${routeData.id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                navigation.goBack();
              } else {
                const data = await res.json();
                Alert.alert('Error', data.message || 'Failed to delete route');
              }
            } catch (err) {
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30,  marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Edit Route</Text>

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
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 20 }}
      />

      {/* Coordinates shown but locked */}
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Coordinates (read-only):</Text>
      <Text style={{ color: '#555', marginBottom: 20 }}>
        {routeData.coordinates?.join('; ') ?? 'No coordinates available'}
      </Text>

      {/* Save button */}
      <TouchableOpacity onPress={handleSave} style={{ backgroundColor: 'green', padding: 15, borderRadius: 6, marginBottom: 15 }} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity onPress={handleDelete} style={{ backgroundColor: 'red', padding: 15, borderRadius: 6 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Delete Route</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}