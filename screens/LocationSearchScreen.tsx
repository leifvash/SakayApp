import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { Ionicons } from '@expo/vector-icons';
import locationSearchStyles from '../styles/LocationSearchStyles';

type Location = {
  id: string;
  name: string;
};

type SearchParams = {
  type: 'origin' | 'destination';
};

const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-01', name: 'Limketkai Mall' },
  { id: 'loc-02', name: 'Gaisano City' },
  { id: 'loc-03', name: 'Carmen Market' },
  { id: 'loc-04', name: 'Divisoria Terminal' },
  { id: 'loc-05', name: 'Lapasan Highway' },
];

export default function LocationSearchScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<{ params: SearchParams }, 'params'>>();
    const { type } = route.params;

    const [query, setQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<Location[]>(MOCK_LOCATIONS);

    const handleSearch = (text: string) => {
      setQuery(text);
      const filtered = MOCK_LOCATIONS.filter((loc) =>
        loc.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    };

    const handleSelectLocation = (location: Location) => {
      navigation.navigate('Main', { [type]: location });
    };

    return (
        <SafeAreaView style={locationSearchStyles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Ionicons name="arrow-back" size={30} color="black" />
            <Text style={locationSearchStyles.header}>Select {type === 'origin' ? 'Origin' : 'Destination'}</Text>
          </TouchableOpacity>
            <TextInput
                value={query}
                onChangeText={handleSearch}
                placeholder="Search location..."
                style={locationSearchStyles.input}
            />
            <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={locationSearchStyles.item} onPress={() => handleSelectLocation(item)}>
                    <Text style={locationSearchStyles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
              )}
            />
          </SafeAreaView>
    );
}

const styles = StyleSheet.create({

});