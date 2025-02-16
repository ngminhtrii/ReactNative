import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.1.2:5000';

const RegisterOTPScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {userId} = route.params;
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('/api/auth/verify-register', {
        userId,
        otp,
      });
      setMessage(response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error);
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default RegisterOTPScreen;
