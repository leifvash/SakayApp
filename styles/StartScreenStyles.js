import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  userButton: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 8,
  },
  adminButton: {
    backgroundColor: '#28a745',
    padding: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});