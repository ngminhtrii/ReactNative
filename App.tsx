import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>HomePage</Text>
    </SafeAreaView>
  );
}

function SplashScreen({navigation}: {navigation: any}): React.JSX.Element {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashContainer}>
      <Text style={styles.splashText}>Welcome to My Profile</Text>
      <Text style={styles.introText}>
        Xin chào, tôi là Nguyen Minh Tri, vui lòng đợi giây lát để có thể xem
        profile.
      </Text>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
