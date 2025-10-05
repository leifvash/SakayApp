import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import componentStyles from '../styles/componentStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  RouteList: { mode: string };
  RouteMap: { routeId: string };
  // add other routes here as needed
};

export default function MapOverlay() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View pointerEvents='box-none' style={componentStyles.container}>   

        {/* <View pointerEvents='auto' style={componentStyles.upperviewstyle}>
            <View>
                <Text>Welcome to Sakay App!</Text>
            </View>
        </View> */}

        <View pointerEvents='auto' style={componentStyles.lowerviewstyle}>  
            <View>
                <Text style={componentStyles.header}>Where to?</Text>
                <View style={componentStyles.originAndDestination}>
                    <Ionicons name="map-outline" size={24} color="black"/>
                    <Text style={componentStyles.subheader}>Origin</Text>
                </View>
            <TextInput
                // value={origin}
                // onChangeText={setOrigin}
                placeholder="Enter origin"
                style={componentStyles.input}
            />

            <View style={componentStyles.originAndDestination}>
                    <Ionicons name="navigate-outline" size={24} color="black"/>
                    <Text style={componentStyles.subheader}>Destination</Text>
            </View>
            <TextInput
                // value={destination}
                // onChangeText={setDestination}
                placeholder="Enter destination"
                style={componentStyles.input}
            />
            <View style={componentStyles.buttonRow}>
                <TouchableOpacity style={componentStyles.button} onPress={() => {navigation.navigate('RouteList', { mode: 'jeepney' })}}>

                    <Text style={componentStyles.buttonText}>See Jeepney Routes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={componentStyles.button} onPress={() => {navigation.navigate('RouteList', { mode: 'tricycle' })}}>
                    <Text style={componentStyles.buttonText}>See Tricycle Routes</Text>
                </TouchableOpacity>
            </View>

            </View>
        </View>

    </View>
  );
};