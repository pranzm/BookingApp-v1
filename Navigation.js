import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingPage from './BookingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import HomePage from './HomePage';
import CalendarOverviewPage from './CalendarOverviewPage';
import ParkingMapPage from './ParkingMapPage';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Booking">
        <Stack.Screen name="Booking" component={BookingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="CalendarOverview" component={CalendarOverviewPage} />
        <Stack.Screen name="ParkingMap" component={ParkingMapPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
