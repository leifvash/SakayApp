import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  upperviewstyle: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 5,
  },
  lowerviewstyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 5,
    height: 300,
  }
});