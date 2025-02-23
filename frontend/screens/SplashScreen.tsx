import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {RouteProp} from '@react-navigation/native';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
}

const SplashScreen: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Onboard');
    }, 10000); // 3 seconds delay
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>Đang tải...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222', // Màu nền cho splash
  },
  logo: {
    width: 150, // Điều chỉnh chiều rộng của logo
    height: 150, // Điều chỉnh chiều cao của logo
    resizeMode: 'contain', // Đảm bảo hình ảnh không bị méo
    marginBottom: 20, // Khoảng cách giữa logo và subtitle
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20, // Điều chỉnh vị trí xuống gần cuối màn hình
  },
});

export default SplashScreen;
