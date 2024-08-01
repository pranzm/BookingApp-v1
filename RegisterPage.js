import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import logger from './logger';

const RegisterPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10}$/; // Simple validation for 10-digit phone numbers
    return re.test(String(phoneNumber));
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    logger.log('Attempting to register', { email });

    try {
      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, mobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        logger.log('Registration successful', { email, data });
        Alert.alert('Registration Successful', 'You can now log in with your credentials.');
        navigation.navigate('Login');
      } else {
        logger.error('Registration failed', data);
        Alert.alert('Registration Failed', data.message || 'An error occurred during registration');
      }
    } catch (error) {
      logger.error('Registration error', error);
      Alert.alert('Registration Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>
      
      <Text style={styles.signInText}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  registerButton: {
    width: '100%',
    backgroundColor: '#4c9fbf',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
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

export default RegisterPage;
