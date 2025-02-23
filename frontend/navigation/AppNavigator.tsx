import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OnboardScreen from '../screens/OnboardScreen';
import RegisterOTPScreen from '../screens/RegisterOTPScreen';
import ForgotPasswordOTPScreen from '../screens/ForgotPasswordOTPScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Onboard: undefined;
  RegisterOTP: {userId: string};
  ForgotPasswordOTP: {userId: string};
  Profile: undefined; // Ensure this matches the screen name used in navigation
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboard"
          component={OnboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="RegisterOTP" component={RegisterOTPScreen} />
        <Stack.Screen
          name="ForgotPasswordOTP"
          component={ForgotPasswordOTPScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
