import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ParkingMapPage = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const [parkingSpots, setParkingSpots] = useState({
    P01: 'occupied',
    P02: 'available',
    P03: 'occupied',
    P04: 'occupied',
    P05: 'occupied',
    P06: 'available',
    P07: 'occupied',
    P08: 'available',
    P09: 'available',
    P10: 'available',
  });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [timeRange, setTimeRange] = useState('08:00 - 18:00');

  const handleParkingSpotPress = (spot) => {
    if (parkingSpots[spot] === 'available') {
      setSelectedSpot(spot);
    } else {
      Alert.alert(`Parking spot ${spot} is not available.`);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSpot) {
      Alert.alert(`Parking spot ${selectedSpot} booked for ${selectedDate} from ${timeRange}.`);
      // Implement booking logic here
    }
  };

  const handleCancelBooking = () => {
    setSelectedSpot(null);
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} />
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
            <Text style={styles.boldText}>{selectedDate}</Text> <Text>{timeRange}</Text>
          </Text>
          <View style={styles.timePicker}>
            <Picker
              selectedValue={timeRange}
              onValueChange={(itemValue) => setTimeRange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="08:00 - 18:00" value="08:00 - 18:00" />
              <Picker.Item label="09:00 - 17:00" value="09:00 - 17:00" />
              <Picker.Item label="10:00 - 16:00" value="10:00 - 16:00" />
              {/* Add more time ranges as needed */}
            </Picker>
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
