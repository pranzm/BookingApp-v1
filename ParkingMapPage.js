import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ParkingMapPage = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const [parkingSpots, setParkingSpots] = useState({});
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    try {
      const response = await fetch('https://ghcr-parking-back-end.onrender.com/api/getParkingSlots');
      const data = await response.json();
      if (response.ok) {
        const slots = data.data.reduce((acc, slot) => {
          acc[`P${slot.slotNumber.toString().padStart(2, '0')}`] = slot.isOccupied ? 'occupied' : 'available';
          return acc;
        }, {});
        setParkingSpots(slots);
      } else {
        Alert.alert('Error', 'Failed to retrieve parking slots');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching parking slots');
    }
  };

  const handleParkingSpotPress = (spot) => {
    if (parkingSpots[spot] === 'available') {
      setSelectedSpot(spot);
    } else {
      Alert.alert(`Parking spot ${spot} is not available.`);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSpot) {
      Alert.alert(`Parking spot ${selectedSpot} booked for ${selectedDate} from ${formatTime(startTime)} to ${formatTime(endTime)}.`);
      // Implement booking logic here
    }
  };

  const handleCancelBooking = () => {
    setSelectedSpot(null);
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  const handleConfirmStartTime = (date) => {
    setStartTime(date);
    hideStartTimePicker();
  };

  const handleConfirmEndTime = (date) => {
    setEndTime(date);
    hideEndTimePicker();
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>

      <Picker selectedValue={selectedDate} style={styles.picker}>
        <Picker.Item label={selectedDate} value={selectedDate} />
        {/* Add more dates as needed */}
      </Picker>

      <View style={styles.mapContainer}>
        {Object.keys(parkingSpots).map((spot) => (
          <TouchableOpacity
            key={spot}
            style={[
              styles.parkingSpot,
              parkingSpots[spot] === 'available' ? styles.available : styles.occupied,
            ]}
            onPress={() => handleParkingSpotPress(spot)}
          >
            <Text style={styles.parkingSpotText}>{spot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSpot && (
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmText}>Book Space for {selectedSpot}?</Text>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>{selectedDate}</Text> from <Text>{formatTime(startTime)}</Text> to <Text>{formatTime(endTime)}</Text>
          </Text>
          <View style={styles.timePicker}>
            <TouchableOpacity onPress={showStartTimePicker}>
              <Text style={styles.timePickerText}>Select Start Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={startTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmStartTime}
              onCancel={hideStartTimePicker}
            />
            <TouchableOpacity onPress={showEndTimePicker}>
              <Text style={styles.timePickerText}>Select End Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={endTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmEndTime}
              onCancel={hideEndTimePicker}
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
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    color: '#4c9fbf',
    marginBottom: 10,
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
