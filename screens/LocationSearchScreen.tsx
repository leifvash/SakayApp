import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput ,StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../context/LocationContext';
import LocationSearchStyles from '../styles/LocationSearchStyles';

const MOCK_LOCATIONS = ['Divisoria', 'Cogon', 'Lapasan', 'Bulua', 'Kauswagan'];

const LocationSearchScreen = ({ navigation, route }) => {
  const { setOrigin, setDestination } = useLocation();
  const { type } = route.params;

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLocations = MOCK_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    if (type === 'origin') setOrigin(location);
    else setDestination(location);
    navigation.goBack();
  };
  

  return (
    <SafeAreaView style={LocationSearchStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={30} color="black" />
        <Text style={LocationSearchStyles.header}>Select {type === 'origin' ? 'Origin' : 'Destination'}</Text>
      </TouchableOpacity>
      <TextInput
        style={LocationSearchStyles.input}
        placeholder="Search location..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={LocationSearchStyles.item} onPress={() => handleLocationSelect(item)}>
            <Text style={LocationSearchStyles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text>No matching locations found.</Text>
        }
      />
    </SafeAreaView>
  );
};
export default LocationSearchScreen;

