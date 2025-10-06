import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import routeListStyles from '../styles/RouteListStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

// define typescript types for route items and navigation params
type RouteItem = {
  id: string;
  name: string;
};

type RouteParams = {
  mode: 'jeepney' | 'tricycle';
};

// route data for jeepneys and tricycles
const ROUTES: Record<RouteParams['mode'], RouteItem[]> = {
  jeepney: [
    { id: 'jeep-01', name: 'R1 CARMEN COGON LIMKETKAI GAISANO' },
    { id: 'jeep-02', name: 'R2 COGON CARMEN LICEO GAISANO LIMKETKAI' },
  ],
  tricycle: [
    { id: 'tri-01', name: 'Gaisano Alley' },
    { id: 'tri-02', name: 'CAP Alley' },
  ],
};

// define navigation param list
type RootStackParamList = {
  RouteList: { mode: 'jeepney' | 'tricycle' };
  RouteMap: { routeId: string };
};

export default function RouteListScreen() {
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { mode } = route.params;

  const handleRoutePress = (routeId: string) => {
    navigation.navigate('RouteMap', { routeId });
  };

  const renderRouteItem = ({ item }: { item: RouteItem }) => (
    <TouchableOpacity style={routeListStyles.routeItem}
                      onPress={() => handleRoutePress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={routeListStyles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={routeListStyles.backButton}>
            <Ionicons name="arrow-back" size={30} color="black" />
            <Text style={routeListStyles.backButtonText}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Routes</Text>
          </TouchableOpacity>
          <FlatList
            data={ROUTES[mode]}
            keyExtractor={(item) => item.id}
            renderItem={renderRouteItem}
          />
      </View>
    </SafeAreaView>
  );
}