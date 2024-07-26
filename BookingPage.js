import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const BookingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} />
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>
      <Image source={require('./assets/map.png')} style={styles.map} />
      <Text style={styles.slogan}>Take your bookings into your own hands</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log in / Sign up" onPress={() => navigation.navigate('Login')} color="#4c9fbf" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1f5fe',
    padding: 20,
  },
  logo: {
    width: 310,
    height: 79,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#f57c00',
    marginBottom: 20,
  },
  map: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  slogan: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default BookingPage;
