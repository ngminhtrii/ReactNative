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
import AddProductScreen from '../screens/main/product/ProductForm';
import ProductDetailScreen from '../screens/main/product/ProductDetail';
import ProfileUser from '../screens/main/profile/ProfileUser';
import Discount from '../screens/main/profile/Discount';
import ProductLike from '../screens/main/profile/ProductLike';
import Order from '../screens/main/profile/Order';
import ProductList from '../screens/main/product/ProductList';
import SearchResults from '../screens/main/search/SearchResults';
import CartScreen from '../screens/main/cart/CartScreen';
import OrderScreen from '../screens/main/order/OrderScreen';

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
  SearchResults: undefined;
  Cart: undefined;
  OrderScreen: undefined;
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
          name="SearchResults"
          component={SearchResults}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboard"
          component={OnboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{title: 'Đơn hàng của bạn'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterOTP"
          component={RegisterOTPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPasswordOTP"
          component={ForgotPasswordOTPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}} //dòng này để ẩn header
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProduct"
          component={AddProductScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileUser"
          component={ProfileUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Discount"
          component={Discount}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductLike"
          component={ProductLike}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
