import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const onboardTexts = ['OnboardScreen1', 'OnboardScreen2'];

const OnboardScreen = ({navigation}: {navigation: any}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const handleNext = () => {
    if (currentTextIndex < onboardTexts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{onboardTexts[currentTextIndex]}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Skip" onPress={handleSkip} />
        <Button title="Next" onPress={handleNext} />
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
});

export default OnboardScreen;
