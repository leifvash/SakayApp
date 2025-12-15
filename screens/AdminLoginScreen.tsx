import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import AdminLoginStyles from '../styles/AdminLoginStyles';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

export default function AdminLoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Navigate to RouteList with admin flag
        navigation.replace('RouteList', { isAdmin: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={AdminLoginStyles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={AdminLoginStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={AdminLoginStyles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={AdminLoginStyles.title}>Admin Login</Text>

      {error && <Text style={AdminLoginStyles.errorText}>{error}</Text>}

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={AdminLoginStyles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={AdminLoginStyles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={AdminLoginStyles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={AdminLoginStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}