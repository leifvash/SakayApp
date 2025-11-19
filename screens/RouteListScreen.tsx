import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import routeListStyles from '../styles/RouteListStyles';

// Define the shape of each route item
type RouteItem = {
  id: string;
  name: string;
  direction: string;
};

// Define the navigation stack types for type safety
type RootStackParamList = {
  RouteList: undefined;
  RouteMap: { routeId: string };
};

export default function RouteListScreen() {
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Step 1: Get dynamic API URL from backend
        const configRes = await fetch('http://192.168.1.6:3000/config');
        const config = await configRes.json();
        const dynamicUrl = config.apiUrl;

        console.log('Resolved API_URL:', dynamicUrl);

        // Step 2: Fetch all routes
        const res = await fetch(`${dynamicUrl}/routes`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('❌ Expected array but got:', data);
          return;
        }

        // Step 3: Map route data
        const mapped = data.map((r: any) => ({
          id: r._id,
          name: r.name,
          direction: r.direction,
        }));

        setRoutes(mapped);
      } catch (err) {
        console.error('❌ Failed to fetch routes:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleRoutePress = (routeId: string) => {
    navigation.navigate('RouteMap', { routeId });
  };

  const renderRouteItem = ({ item }: { item: RouteItem }) => (
    <TouchableOpacity
      style={routeListStyles.routeItem}
      onPress={() => handleRoutePress(item.id)}
    >
      <Text>{item.name}</Text>
      <Text>{item.direction}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={routeListStyles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={routeListStyles.backButton}>
          <Ionicons name="arrow-back" size={30} color="black" />
          <Text style={routeListStyles.backButtonText}>Available Routes</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item.id}
            renderItem={renderRouteItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}