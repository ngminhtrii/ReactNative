import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Trang Chủ</Text>
    </SafeAreaView>
  );
}

function SplashScreen({navigation}: {navigation: any}): React.JSX.Element {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000); // 3 giây chờ
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashContainer}>
      <Text style={styles.splashText}>Chào mừng đến với Hồ sơ của tôi</Text>
      <Text style={styles.introText}>
        Xin chào, tôi là Nguyen Minh Tri, vui lòng đợi giây lát để có thể xem hồ
        sơ.
      </Text>
    </SafeAreaView>
  );
}

import AppNavigator from './navigation/AppNavigator';

const App = (): React.JSX.Element => {
  return <AppNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Màu nền trắng
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Màu nền cho splash
  },
  splashText: {
    fontSize: 24,
    fontWeight: '600',
  },
  introText: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 10,
  },
});

export default App;
