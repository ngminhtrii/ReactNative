import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardScreen from '../screens/OnboardScreen';
import RegisterOTPScreen from '../screens/auth/RegisterOTPScreen';
import ForgotPasswordOTPScreen from '../screens/auth/ForgotPasswordOTPScreen';
import ProfileScreen from '../screens/main/profile/HomeProfile';
import AddProductScreen from '../screens/main/product/AddProductScreen';
import ProductDetailScreen from '../screens/main/product/ProductDetailScreen';
import EditProductScreen from '../screens/main/product/EditProductScreen';
import ProfileUser from '../screens/main/profile/ProfileUser';
import Discount from '../screens/main/profile/Discount';
import ProductLike from '../screens/main/profile/ProductLike';
import Order from '../screens/main/profile/Order';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Onboard: undefined;
  RegisterOTP: {userId: string};
  ForgotPasswordOTP: {userId: string};
  Profile: undefined;
  AddProduct: undefined;
  ProductDetail: {productId: string};
  EditProduct: {productId: string}; // Thêm dòng này
  ProfileUser: undefined;
  Discount: undefined;
  ProductLike: undefined;
  Order: undefined;
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
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} />
        <Stack.Screen name="Discount" component={Discount} />
        <Stack.Screen name="ProductLike" component={ProductLike} />
        <Stack.Screen name="Order" component={Order} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
