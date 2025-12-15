import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import routeListStyles from '../styles/RouteListStyles';
import { API_URL } from '@env';

type RouteItem = {
  id: string;
  name: string;
  direction: string;
  district?: string;
};

type RootStackParamList = {
  RouteList: { isAdmin: boolean };
  RouteMap: { routeId: string };
  AddRoute: undefined;
  EditRoute: { route: RouteItem };
};

export default function RouteListScreen() {
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { isAdmin } = route.params as { isAdmin: boolean };
  const isFocused = useIsFocused();

  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/routes`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Expected array');

      const mapped = data.map((r: any) => ({
        id: r._id,
        name: r.name,
        direction: r.direction,
        district: r.district ?? 'Unknown',
      }));

      setRoutes(mapped);
    } catch (err: any) {
      setError('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchRoutes();
    }
  }, [isFocused]);

  // 🔎 Filter routes by search query (name, direction, district)
  const filteredRoutes = routes.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.direction.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.district ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoutePress = (routeId: string) => {
    navigation.navigate('RouteMap', { routeId });
  };

  const handleEditPress = (route: RouteItem) => {
    navigation.navigate('EditRoute', { route });
  };

  const renderRouteItem = ({ item }: { item: RouteItem }) => (
    <View style={routeListStyles.routeItem}>
      <TouchableOpacity onPress={() => handleRoutePress(item.id)} style={{ flex: 1 }}>
        <Text style={routeListStyles.routeName}>{item.name}</Text>
        <Text style={routeListStyles.routeMeta}>
          {item.direction} • {item.district}
        </Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity onPress={() => handleEditPress(item)}>
          <Ionicons name="create-outline" size={22} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={routeListStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={routeListStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={routeListStyles.backButtonText}>Routes</Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddRoute')}
            style={routeListStyles.addButton}
          >
            <Ionicons name="add-circle" size={28} color="blue" />
            <Text style={routeListStyles.addButtonText}>Add Route</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🔎 Search bar */}
      <TextInput
        placeholder="Search routes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          padding: 10,
          marginHorizontal: 10,
          marginBottom: 10,
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.id}
          renderItem={renderRouteItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
              No routes found
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}