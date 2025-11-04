// Import necessary React and React Native components
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import routeListStyles from '../styles/RouteListStyles';
import { API_URL } from '@env';


// Define the shape of each route item
type RouteItem = {
  id: string;     // MongoDB _id used for navigation
  name: string;   // Display name of the route
  direction: string; // Direction of the route
  mode: string; // Mode of transportation (jeepney/tricycle)
};

// Define the expected route parameters passed from previous screen
type RouteParams = {
  mode: 'jeepney' | 'tricycle';  // Determines which type of routes to show
};

// Define the navigation stack types for type safety
type RootStackParamList = {
  RouteList: RouteParams;
  RouteMap: { routeId: string };
};

export default function RouteListScreen() {
  // Hook to navigate between screens
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();

  // Hook to access route parameters (e.g. mode = 'jeepney')
  const route = useRoute<RouteProp<RootStackParamList, 'RouteList'>>();
  const { mode } = route.params;

  // State to hold fetched route data
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true); // Show spinner while loading

  // Fetch route data from backend when screen loads or mode changes
  useEffect(() => {
    console.log('Fetching from:', `${API_URL}/routes`);

    fetch(`${API_URL}/routes`) // Replace with your actual IP
      .then((res) => res.json())
      .then((data) => {
        // Filter routes based on mode (e.g. jeepney or tricycle)
        const filtered = data.filter((r: any) =>
          r.mode?.toLowerCase().trim() === mode.toLowerCase().trim()
        );
        // Map MongoDB data to local RouteItem format
        const mapped = filtered.map((r: any) => ({
          id: r._id,
          name: r.name,
          direction: r.direction,
          mode: r.mode,
        }));
        setRoutes(mapped);     // Save to state
        setLoading(false);     // Stop loading spinner
      });
  }, [mode]);

  // Navigate to RouteMap screen when a route is tapped
  const handleRoutePress = (routeId: string) => {
    navigation.navigate('RouteMap', { routeId });
  };

  // Render each route item in the list
  const renderRouteItem = ({ item }: { item: RouteItem }) => (
    <TouchableOpacity
      style={routeListStyles.routeItem}
      onPress={() => handleRoutePress(item.id)}
    >
      <Text>{item.name}</Text>
      <Text>{item.direction}</Text>
    </TouchableOpacity>
  );

  // Main screen layout
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={routeListStyles.backButtonContainer}>
        {/* Back button with mode label */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={routeListStyles.backButton}>
          <Ionicons name="arrow-back" size={30} color="black" />
          <Text style={routeListStyles.backButtonText}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Routes
          </Text>
        </TouchableOpacity>

        {/* Show loading spinner or route list */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={routes}                         // List of routes to display
            keyExtractor={(item) => item.id}      // Unique key for each item
            renderItem={renderRouteItem}          // How each item is rendered
          />
        )}
      </View>
    </SafeAreaView>
  );
}