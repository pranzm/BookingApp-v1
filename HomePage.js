import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import logger from './logger';

const HomePage = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userBookingsKey = `bookings_${userEmail}`;
      const storedBookings = JSON.parse(await AsyncStorage.getItem(userBookingsKey)) || [];
      setBookings(storedBookings);
    } catch (error) {
      logger.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings.');
    }
  };

  useEffect(() => {
    const fetchFirstName = async () => {
      const storedFirstName = await AsyncStorage.getItem('firstName');
      setFirstName(storedFirstName);
    };

    fetchFirstName();
    fetchBookings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const handleCancelBooking = (index) => {
    logger.log('handleCancelBooking:', { index, booking: bookings[index] });
    setSelectedBooking(bookings[index]);
    setShowConfirmBox(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) {
      logger.error('confirmCancelBooking: No booking selected');
      Alert.alert('Error', 'No booking selected.');
      return;
    }

    try {
      logger.log('confirmCancelBooking:', { bookingId: selectedBooking.bookingId });
      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: selectedBooking.bookingId }),
      });

      const data = await response.json();

      if (data.status === 200) {
        const updatedBookings = bookings.filter((booking) => booking !== selectedBooking);
        setBookings(updatedBookings);
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userBookingsKey = `bookings_${userEmail}`;
        await AsyncStorage.setItem(userBookingsKey, JSON.stringify(updatedBookings));
        setSelectedBooking(null);
        setShowConfirmBox(false);
        Alert.alert('Booking cancelled.');
      } else {
        logger.error('Cancel booking failed:', data);
        Alert.alert('Error', data.message || 'Failed to cancel booking.');
      }
    } catch (error) {
      logger.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking.');
    }
  };

  const closeConfirmBox = () => {
    setSelectedBooking(null);
    setShowConfirmBox(false);
  };

  const handleLogout = async () => {
    logger.log('Attempting to log out');

    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage

      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      const data = await response.json();
      logger.log('Response:', { status: response.status, data });

      if (response.ok) {
        await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
        await AsyncStorage.removeItem('firstName'); // Remove first name from AsyncStorage
        logger.log('Logout successful');
        Alert.alert('Logout Successful', 'You have been logged out.');
        navigation.navigate('Login');
      } else {
        logger.error('Logout failed', data);
        Alert.alert('Logout Failed', data.message || 'An error occurred during logout');
      }
    } catch (error) {
      logger.error('Logout error', error);
      Alert.alert('Logout Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={require('./assets/mastek-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Trust. Value. Velocity</Text>
        <Text style={styles.greeting}>Good Afternoon, <Text style={styles.username}>{firstName}</Text></Text>

        {bookings.map((booking, index) => (
          <View key={index} style={styles.bookingContainer}>
            <Text style={styles.officeHeader}>
              {booking.current ? 'You are in the office today' : 'Upcoming Bookings'}
            </Text>
            <View style={styles.bookingInfo}>
              <Image source={require('./assets/car-icon.png')} style={styles.icon} />
              <View style={styles.bookingDetails}>
                <Text style={styles.date}>{booking.date}</Text>
                <Text style={styles.location}>{`Space ${booking.spot} from ${booking.startTime} to ${booking.endTime}`}</Text>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(index)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.newBookingButton} onPress={() => navigation.navigate('CalendarOverview')}>
          <Text style={styles.newBookingButtonText}>MAKE A NEW BOOKING</Text>
        </TouchableOpacity>
      </ScrollView>

      {showConfirmBox && selectedBooking && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Cancel booking for space {selectedBooking.spot}?</Text>
            <Text style={styles.confirmText}>{selectedBooking.date}</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmCancelBooking}>
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={closeConfirmBox}>
                <Text style={styles.backButtonText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./assets/home-icon.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CalendarOverview')}>
          <Image source={require('./assets/calendar-icon.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Image source={require('./assets/search-icon.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('./assets/settings-icon.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('./assets/logout-icon.png')} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f5fe',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 60, // Adjust this padding to give space for the footer
  },
  logo: {
    width: '100%', // Use a percentage for the width
    height: 60, // Adjust height as needed
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#f57c00',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  bookingContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ffcc80',
    padding: 10,
    borderRadius: 5,
  },
  officeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  bookingDetails: {
    flex: 1,
  },
  date: {
    fontSize: 14,
  },
  location: {
    fontSize: 14,
    color: '#757575',
  },
  cancelButton: {
    backgroundColor: '#4c9fbf',
    padding: 5,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  newBookingButton: {
    width: '80%',
    backgroundColor: '#4c9fbf',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  newBookingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60, // Adjust this to ensure it does not overlap the footer
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#4c9fbf',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ff7043',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#4c9fbf', // Set background color for the footer
    position: 'absolute',
    bottom: 0,
  },
  footerIcon: {
    width: 40,
    height: 40,
  },
});

export default HomePage;
