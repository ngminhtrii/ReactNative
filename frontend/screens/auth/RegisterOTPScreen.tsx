import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import axios from 'axios';
import config from '../../config/config';

axios.defaults.baseURL = config.baseURL;

const RegisterOTPScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState(''); // Thêm state cho email
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('/auth/verify-otp', {
        email, // Gửi email
        otp, // Gửi OTP
      });
      setMessage(response.data.message);
      navigation.navigate('Login'); // Chuyển đến trang Login sau khi gửi OTP thành công
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
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail} // Cập nhật email
      />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp} // Cập nhật OTP
      />
      <Button title="Send OTP" onPress={handleSendOTP} />
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
