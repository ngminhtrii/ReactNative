import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';

axios.defaults.baseURL = config.baseURL;

const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://via.placeholder.com/150',
  );
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initialPhoneNumber, setInitialPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
          throw new Error('No token or user ID found');
        }
        const response = await axios.get('/api/auth/profile', {
          params: {userId},
          headers: {Authorization: `Bearer ${token}`},
        });
        const {email, phoneNumber, profileImageUrl} = response.data;
        setEmail(email);
        setPhoneNumber(phoneNumber);
        setInitialPhoneNumber(phoneNumber);
        setProfileImageUrl(
          profileImageUrl || 'https://via.placeholder.com/150',
        );
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error fetching profile', (error as any).message);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        throw new Error('No token or user ID found');
      }

      const response = await axios.post(
        '/api/auth/update-profile',
        {
          userId,
          email,
          phoneNumber,
          profileImageUrl,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (response.data.message === 'Profile updated successfully') {
        if (phoneNumber !== initialPhoneNumber) {
          setIsOtpSent(true);
          Alert.alert('OTP sent to your email');
        } else {
          Alert.alert('Profile updated successfully');
        }
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      Alert.alert('Error updating profile', (error as any).message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
        '/api/auth/verify-otp',
        {
          email,
          otp,
          phoneNumber,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      Alert.alert(response.data.message);
      setIsOtpSent(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error verifying OTP', (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      {!isOtpSent ? (
        <>
          <TouchableOpacity>
            <Image source={{uri: profileImageUrl}} style={styles.avatar} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Update Profile" onPress={handleUpdateProfile} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000', // Viền đen
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ProfileScreen;
