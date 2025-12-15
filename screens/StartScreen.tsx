import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import StartScreenStyles from '../styles/StartScreenStyles';

export default function StartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={StartScreenStyles.container}>
      <Text style={StartScreenStyles.title}>SakayApp</Text>
      <Text style={StartScreenStyles.subtitle}>Find your ride or manage routes</Text>

      <View style={StartScreenStyles.buttonRow}>
        <TouchableOpacity
          style={StartScreenStyles.userButton}
          onPress={() => navigation.navigate('MainScreen')}
        >
          <Text style={StartScreenStyles.buttonText}>User 👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={StartScreenStyles.adminButton}
          onPress={() => navigation.navigate('AdminLoginScreen')}
        >
          <Text style={StartScreenStyles.buttonText}>Admin 🛠️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}