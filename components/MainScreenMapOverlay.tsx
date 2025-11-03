import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import mapOverlayStyles from '../styles/MapOverlayStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { useLocation } from '../context/LocationContext';

export default function MapOverlay() {
    
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { origin, destination } = useLocation();

    const originLabel = origin ? origin : 'Tap to select origin';
    const destinationLabel = destination ? `${destination}` : destination ? destination : 'Tap to select destination';

  return (
    <View pointerEvents='box-none' style={mapOverlayStyles.container}>

        <View pointerEvents='auto' style={mapOverlayStyles.lowerviewstyle}>
            <Text style={mapOverlayStyles.header}>Where to?</Text>

            <TouchableOpacity style={mapOverlayStyles.originAndDestinationContainer} onPress={() => navigation.navigate('LocationSearch', { type: 'origin' })}>
                <View style={mapOverlayStyles.originAndDestination}>
                    <Ionicons name="map-outline" size={24} color="blue" />
                    <Text style={mapOverlayStyles.subheader}>Origin</Text>
                </View>
                <Text style={mapOverlayStyles.originAndDestinationText}>{originLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={mapOverlayStyles.originAndDestinationContainer} onPress={() => navigation.navigate('LocationSearch', { type: 'destination' })}>
                <View style={mapOverlayStyles.originAndDestination}>
                    <Ionicons name="navigate-outline" size={24} color="orange" />
                    <Text style={mapOverlayStyles.subheader}>Destination</Text>
                </View>
                <Text style={mapOverlayStyles.originAndDestinationText}>{destinationLabel}</Text>
            </TouchableOpacity>

            <View style={mapOverlayStyles.buttonRow}>
                <TouchableOpacity style={mapOverlayStyles.button} onPress={async () => {
                    // try {
                    // const res = await fetch('http://192.168.1.3:3000/routes');
                    // const data = await res.json();
                    // const jeepneyRoutes = data.filter((r: any) => r.mode === 'jeepney');
                    // console.log('Jeepney routes fetched:', jeepneyRoutes); // ✅ Debug log

                    navigation.navigate('RouteList', { mode: 'jeepney' });
                    // } catch (err) {
                    // console.error('Error fetching jeepney routes:', err);
                    // }
                }}
>
                    <Text style={mapOverlayStyles.buttonText}>See Jeepney Routes</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={mapOverlayStyles.button} onPress={() => navigation.navigate('RouteList', { mode: 'tricycle' })}>
                    <Text style={mapOverlayStyles.buttonText}>See Tricycle Routes</Text>
                </TouchableOpacity> */}
            </View>
      </View>
    </View>
    
  );
}