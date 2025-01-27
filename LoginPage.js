import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from './logger';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchUserDetails = async (email) => {
    try {
      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      logger.log('User List Response:', data);

      if (data && data.length > 0) {
        const user = data.find(user => user.email === email);
        if (user) {
          return user;
        } else {
          logger.error('User not found in the list', data);
          Alert.alert('Login Failed', 'User not found.');
          return null;
        }
      } else {
        logger.error('Failed to fetch user list', data);
        Alert.alert('Login Failed', 'Failed to fetch user list.');
        return null;
      }
    } catch (error) {
      logger.error('Fetch user details error', error);
      Alert.alert('Login Failed', 'An error occurred while fetching user details.');
      return null;
    }
  };

  const handleLogin = async () => {
    logger.log('Attempting to log in', { email });

    try {
      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      logger.log('Login Response:', data);

      const token = data.data;
      if (token) {
        const userDetails = await fetchUserDetails(email);
        if (userDetails) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('firstName', userDetails.firstName);
          await AsyncStorage.setItem('username', userDetails.username);
          await AsyncStorage.setItem('userEmail', userDetails.email);
          logger.log('Login successful', { email, data });
          Alert.alert('Login Successful', 'You are now logged in.');
          navigation.navigate('Home');
        }
      } else {
        logger.error('Login failed, token missing', data);
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      logger.error('Login error', error);
      Alert.alert('Login Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>
      
      <Text style={styles.signInText}>Sign into your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>Terms of use. Privacy policy</Text>
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
    width: 200,  // Adjust width as needed
    height: 80,  // Adjust height as needed
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#f57c00',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#4c9fbf',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#4c9fbf',
    marginBottom: 10,
  },
  registerText: {
    color: '#4c9fbf',
    marginBottom: 10,
  },
  termsContainer: {
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default LoginPage;
