import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';

const onboardImages = [
  require('../../assets/anh01.png'),
  require('../../assets/anh02.png'),
];

const OnboardScreen = ({navigation}: {navigation: any}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex === onboardImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 2000); // 2 giây

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (currentImageIndex < onboardImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={onboardImages[currentImageIndex]} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%', // Điều chỉnh chiều rộng
    height: '95%', // Điều chỉnh chiều cao
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default OnboardScreen;
