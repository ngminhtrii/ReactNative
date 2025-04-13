import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

axios.defaults.baseURL = config.baseURL;

const LoginScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Bắt đầu trạng thái tải
    try {
      const response = await axios.post('/auth/login', {email, password});
      console.log(response.data); // Kiểm tra phản hồi từ API

      // Lấy token và userId từ phản hồi
      const {token, _id: userId} = response.data.data;

      // Kiểm tra nếu token hoặc userId không tồn tại
      if (!token || !userId) {
        throw new Error('Token hoặc User ID không hợp lệ');
      }

      // Lưu token và userId vào AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      Alert.alert('Đăng nhập thành công');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Error logging in:', error);

      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      Alert.alert('Error logging in', errorMessage);
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.customButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.customButtonText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  customButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default LoginScreen;
