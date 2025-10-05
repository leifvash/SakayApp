import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import componentStyles from '../styles/componentStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteItem = {
  id: string;
  name: string;
};

type RouteParams = {
  mode: 'jeepney' | 'tricycle';
};

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
    <TouchableOpacity onPress={() => handleRoutePress(item.id)}>
      <Text >{item.name}</Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Ionicons name="arrow-back" size={30} color="black" />
            <Text style={{ marginHorizontal: 10, fontSize: 30, marginBottom: 10 }}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Routes</Text>
          </TouchableOpacity>
        <FlatList
          data={ROUTES[mode]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: '#eee', marginBottom: 10 }}
              onPress={() => navigation.navigate('RouteMap', { routeId: item.id })}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}