import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const HomePage = ({ navigation }) => {
  const [bookings, setBookings] = useState([
    { date: '15 July 2024', location: 'iSprout Car Park | Space P10', current: true },
    { date: '16 July 2024', location: 'iSprout Car Park | Space P09', current: false },
    { date: '17 July 2024', location: 'iSprout Car Park | Space P05', current: false },
    { date: '18 July 2024', location: 'iSprout Car Park | Space P02', current: false },
  ]);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleCancelBooking = (index) => {
    setSelectedBooking(bookings[index]);
    setShowConfirmBox(true);
  };

  const confirmCancelBooking = () => {
    const updatedBookings = bookings.filter((booking) => booking !== selectedBooking);
    setBookings(updatedBookings);
    setSelectedBooking(null);
    setShowConfirmBox(false);
    Alert.alert('Booking cancelled.');
  };

  const closeConfirmBox = () => {
    setSelectedBooking(null);
    setShowConfirmBox(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={require('./assets/mastek-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Trust. Value. Velocity</Text>
        <Text style={styles.greeting}>Good afternoon/evening, <Text style={styles.username}>Username</Text></Text>

        {bookings.map((booking, index) => (
          <View key={index} style={styles.bookingContainer}>
            <Text style={styles.officeHeader}>
              {booking.current ? 'You are in the office today' : 'Upcoming Bookings'}
            </Text>
            <View style={styles.bookingInfo}>
              <Image source={require('./assets/car-icon.png')} style={styles.icon} />
              <View style={styles.bookingDetails}>
                <Text style={styles.date}>{booking.date}</Text>
                <Text style={styles.location}>{booking.location}</Text>
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

      {showConfirmBox && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Cancel booking for space {selectedBooking.location.split(' ').pop()}?</Text>
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
    fontSize: 18,
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
    width: '90%',
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
    fontSize: 16,
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
    fontSize: 16,
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
