import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from './logger';

const ParkingMapPage = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: new Date(), end: new Date() });
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  useEffect(() => {
    fetch('https://ghcr-parking-back-end.onrender.com/api/getParkingSlots')
      .then(response => response.json())
      .then(data => {
        setParkingSpots(data.data);
      })
      .catch(error => {
        logger.error('Error fetching parking slots:', error);
        Alert.alert('Error', 'Failed to fetch parking slots.');
      });
  }, []);

  const handleParkingSpotPress = (spot) => {
    if (!spot.isOccupied) {
      setSelectedSpot(spot.slotNumber);
    } else {
      Alert.alert(`Parking spot ${spot.slotNumber} is not available.`);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSpot) {
      try {
        const username = await AsyncStorage.getItem('username');
        const userEmail = await AsyncStorage.getItem('userEmail');

        if (!username || !userEmail) {
          Alert.alert('Error', 'User details not found. Please log in again.');
          return;
        }

        const bookingRequest = {
          username,
          userEmail,
          parkingSlotNumber: selectedSpot,
          bookingStartDateTime: timeRange.start.toISOString(),
          bookingEndDateTime: timeRange.end.toISOString(),
          comment: "Booking through app"
        };

        const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/book-slot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingRequest)
        });

        const data = await response.json();

        if (data.status === 201) {
          Alert.alert('Booking Confirmed', `Parking spot ${selectedSpot} booked for ${selectedDate}.`);

          // Update the spot color to red after successful booking
          setParkingSpots(prevSpots =>
            prevSpots.map(spot =>
              spot.slotNumber === selectedSpot ? { ...spot, isOccupied: true } : spot
            )
          );

          // Save the booking details in AsyncStorage
          const newBooking = {
            bookingId: data.data.bookingId,
            date: selectedDate,
            spot: selectedSpot,
            startTime: timeRange.start.toLocaleTimeString(),
            endTime: timeRange.end.toLocaleTimeString(),
            current: true,
          };

          const storedBookings = JSON.parse(await AsyncStorage.getItem('bookings')) || [];
          storedBookings.push(newBooking);
          await AsyncStorage.setItem('bookings', JSON.stringify(storedBookings));
        } else {
          logger.error('Booking failed:', data);
          Alert.alert('Booking Failed', data.message || 'Failed to book the parking spot.');
        }
      } catch (error) {
        logger.error('Booking error:', error);
        Alert.alert('Booking Failed', 'An error occurred while booking the parking spot.');
      }
    } else {
      Alert.alert('Please select a parking spot first.');
    }
  };

  const handleCancelBooking = () => {
    setSelectedSpot(null);
  };

  const handleConfirmStartTime = (time) => {
    setTimeRange(prev => ({ ...prev, start: time }));
    setStartTimePickerVisible(false);
  };

  const handleConfirmEndTime = (time) => {
    setTimeRange(prev => ({ ...prev, end: time }));
    setEndTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>

      <Picker selectedValue={selectedDate} style={styles.picker}>
        <Picker.Item label={selectedDate} value={selectedDate} />
      </Picker>

      <View style={styles.mapContainer}>
        {parkingSpots.map((spot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.parkingSpot,
              spot.isOccupied ? styles.occupied : styles.available,
            ]}
            onPress={() => handleParkingSpotPress(spot)}
          >
            <Text style={styles.parkingSpotText}>{`P${spot.slotNumber}`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSpot && (
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmText}>Book Space for P{selectedSpot}?</Text>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>{selectedDate}</Text> <Text>{`${timeRange.start.toLocaleTimeString()} - ${timeRange.end.toLocaleTimeString()}`}</Text>
          </Text>
          <View style={styles.timePicker}>
            <TouchableOpacity onPress={() => setStartTimePickerVisible(true)} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>Set Start Time</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEndTimePickerVisible(true)} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>Set End Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={startTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmStartTime}
              onCancel={() => setStartTimePickerVisible(false)}
            />
            <DateTimePickerModal
              isVisible={endTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmEndTime}
              onCancel={() => setEndTimePickerVisible(false)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
              <Text style={styles.confirmButtonText}>CONFIRM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f5fe',
    padding: 20,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#f57c00',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  parkingSpot: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  available: {
    backgroundColor: 'green',
  },
  occupied: {
    backgroundColor: 'red',
  },
  parkingSpotText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  timePicker: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeButton: {
    backgroundColor: '#4c9fbf',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
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
  cancelButton: {
    backgroundColor: '#ff7043',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
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
    marginTop: 20,
  },
  footerIcon: {
    width: 40,
    height: 40,
  },
});

export default ParkingMapPage;
