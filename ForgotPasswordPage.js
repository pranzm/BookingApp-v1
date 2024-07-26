import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ForgotPasswordPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} />
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>RESET PASSWORD</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Back to Login
      </Text>
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
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#f57c00',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4c9fbf',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#4c9fbf',
    marginTop: 20,
  },
});

export default ForgotPasswordPage;
