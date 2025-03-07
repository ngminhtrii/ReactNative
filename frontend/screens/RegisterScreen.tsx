import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import axios from 'axios';
import config from '../config/config';

axios.defaults.baseURL = config.baseURL;

const RegisterScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
        name,
      });
      setMessage(response.data.message);
      setUserId(response.data.userId);

      // Gửi OTP sau khi đăng ký thành công
      await axios.post('/api/auth/send-otp', {email});

      navigation.navigate('RegisterOTP', {userId: response.data.userId});
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
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

export default RegisterScreen;
