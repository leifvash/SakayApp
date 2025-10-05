import { TouchableOpacity, View, Text } from 'react-native';
import componentStyles from '../styles/componentStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapOverlay() {
  return (
    <View pointerEvents='box-none' style={componentStyles.container}>   

        <View pointerEvents='auto' style={componentStyles.upperviewstyle}>
            <TouchableOpacity>
                <Text>Upper Part</Text>
            </TouchableOpacity>
        </View>

        <View pointerEvents='auto' style={componentStyles.lowerviewstyle}>  
            <TouchableOpacity>
                <Text>Lower Part</Text>
            </TouchableOpacity>
        </View>

    </View>
  );
};
