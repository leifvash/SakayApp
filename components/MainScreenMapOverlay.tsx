import { TouchableOpacity, View, Text } from 'react-native';
import mapOverlayStyles from '../styles/MapOverlayStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { useLocation } from '../context/LocationContext';
import { useEffect } from 'react';
import { API_URL } from '@env';



export default function MapOverlay() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { origin, destination, recommendedPlan, setRecommendedPlan } = useLocation();

  // Format coordinates nicely, or show placeholder text
  const originLabel = origin
    ? `${origin.latitude.toFixed(5)}, ${origin.longitude.toFixed(5)}`
    : 'Tap to select origin';

  const destinationLabel = destination
    ? `${destination.latitude.toFixed(5)}, ${destination.longitude.toFixed(5)}`
    : 'Tap to select destination';

  // 🔧 Automatically fetch recommended route when both origin & destination are set
  useEffect(() => {
    async function fetchRecommendedRoute() {
      if (origin && destination) {
        try {
          const response = await fetch(`${API_URL}/routes/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              origin: { lat: origin.latitude, lng: origin.longitude },
              destination: { lat: destination.latitude, lng: destination.longitude },
              thresholdMeters: 200
            })
          });

          if (response.ok) {
            const data = await response.json();
            setRecommendedPlan(data.route);
          } else {
            setRecommendedPlan(null);
            console.log("⚠️ No route found");
          }
        } catch (err) {
          console.error("❌ Error fetching route:", err);
        }
      }
    }

    fetchRecommendedRoute();
  }, [origin, destination]);

  return (
    <View pointerEvents="box-none" style={mapOverlayStyles.container}>
      <View pointerEvents="auto" style={mapOverlayStyles.lowerviewstyle}>
        <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={{padding: 5, }}>Back</Text>
      </TouchableOpacity>

        <Text style={mapOverlayStyles.header}>Where to?</Text>

        {/* Origin Picker */}
        <TouchableOpacity
          style={mapOverlayStyles.originAndDestinationContainer}
          onPress={() => navigation.navigate('MapPicker', { type: 'origin' })}
        >
          <View style={mapOverlayStyles.originAndDestination}>
            <Ionicons name="map-outline" size={24} color="blue" />
            <Text style={mapOverlayStyles.subheader}>Origin</Text>
          </View>
          <Text style={mapOverlayStyles.originAndDestinationText}>{originLabel}</Text>
        </TouchableOpacity>

        {/* Destination Picker */}
        <TouchableOpacity
          style={mapOverlayStyles.originAndDestinationContainer}
          onPress={() => navigation.navigate('MapPicker', { type: 'destination' })}
        >
          <View style={mapOverlayStyles.originAndDestination}>
            <Ionicons name="navigate-outline" size={24} color="orange" />
            <Text style={mapOverlayStyles.subheader}>Destination</Text>
          </View>
          <Text style={mapOverlayStyles.originAndDestinationText}>{destinationLabel}</Text>
        </TouchableOpacity>

        {/* Routes Button */}
        <View style={mapOverlayStyles.buttonRow}>
          <TouchableOpacity
            style={mapOverlayStyles.button}
            onPress={() => navigation.navigate('RouteList', { isAdmin: false })}
          >
            <Text style={mapOverlayStyles.buttonText}>See Routes</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}