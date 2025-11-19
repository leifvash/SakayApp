import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  name: string;
  fare: number;
  stops: string[];
};

const RouteDetailsOverlay = ({ name, fare, stops }: Props) => {
  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Fare: ₱{fare}</Text>
      <Text style={styles.sectionTitle}>Stops:</Text>
      {Array.isArray(stops) && stops.length > 0 ? (
        stops.map((stop, index) => (
          <Text key={index}>{stop}</Text>
        ))
      ) : (
        <Text>No stops available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 5 },
  sectionTitle: { marginTop: 10, fontWeight: 'bold', fontSize: 18 },
  stop: { fontSize: 16, marginVertical: 2 },
});

export default RouteDetailsOverlay;