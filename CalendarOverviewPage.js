import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';

const CalendarOverviewPage = ({ navigation }) => {
  const [selectedZone, setSelectedZone] = useState('ispout');
  const [markedDates, setMarkedDates] = useState({
    '2024-02-12': { selected: true, marked: true, selectedColor: 'red', disabled: true },
    '2024-02-16': { marked: true },
    '2024-02-17': { marked: true, dotColor: 'red', activeOpacity: 0 },
    '2024-02-18': { disabled: true, disableTouchEvent: true },
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const onDayPress = (day) => {
    if (markedDates[day.dateString]?.disabled) {
      Alert.alert('This date is not available for booking.');
      return;
    }

    const newMarkedDates = { ...markedDates };
    newMarkedDates[day.dateString] = {
      ...newMarkedDates[day.dateString],
      selected: !newMarkedDates[day.dateString]?.selected,
      selectedColor: !newMarkedDates[day.dateString]?.selected ? 'blue' : undefined,
    };

    setMarkedDates(newMarkedDates);
    setSelectedDate(day.dateString);
  };

  const handleGoToMap = () => {
    if (!selectedDate) {
      Alert.alert('Please select a date first.');
      return;
    }
    navigation.navigate('ParkingMap', { selectedDate });
  };

  const handleGetRandomSpace = () => {
    if (!selectedDate) {
      Alert.alert('Please select a date first.');
      return;
    }
    Alert.alert(`Random space booked for ${selectedDate}.`);
    // Implement logic to get a random space
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/mastek-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Trust. Value. Velocity</Text>
      
      <Picker
        selectedValue={selectedZone}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedZone(itemValue)}
      >
        <Picker.Item label="iSprout Car Park" value="ispout" />
        {/* Add more zones as needed */}
      </Picker>

      <Calendar
        current={'2024-02-01'}
        minDate={'2024-01-01'}
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        onMonthChange={(month) => {
          console.log('month changed', month);
        }}
        hideArrows={false}
        renderArrow={(direction) => (
          <Text>{direction === 'left' ? '<' : '>'}</Text>
        )}
        hideExtraDays={true}
        disableMonthChange={true}
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}
        disableAllTouchEventsForDisabledDays={true}
        enableSwipeMonths={true}
        markedDates={markedDates}
      />

      {selectedDate && (
        <View style={styles.bookingContainer}>
          <Text style={styles.bookingText}>Book a space for {selectedDate}:</Text>
          <TouchableOpacity style={styles.bookingButton} onPress={handleGoToMap}>
            <Text style={styles.bookingButtonText}>GO TO MAP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingButton} onPress={handleGetRandomSpace}>
            <Text style={styles.bookingButtonText}>GET RANDOM SPACE</Text>
          </TouchableOpacity>
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
    paddingBottom: 80,  // Ensure enough padding at the bottom to avoid overlap
    alignItems: 'center',
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
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  bookingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  bookingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  bookingButton: {
    backgroundColor: '#4c9fbf',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  bookingButtonText: {
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

export default CalendarOverviewPage;
