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
import * as ImagePicker from 'react-native-image-picker';
import cloudinaryUpload from '../services/uploads';

axios.defaults.baseURL = 'http://192.168.2.70:5000'; // Ensure this matches your server configuration

const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://via.placeholder.com/150',
  );
  const [imageData, setImageData] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
      let uploadedImageUrl = profileImageUrl;

      if (imageData) {
        const uploadData = new FormData();
        uploadData.append('file', {
          uri: imageData.uri,
          type: 'image/jpeg', // Ensure the image format is correct
          name: 'profile.jpg',
        });

        const uploadResponse = await cloudinaryUpload(uploadData);
        if (uploadResponse && uploadResponse.secure_url) {
          uploadedImageUrl = uploadResponse.secure_url;
        } else {
          throw new Error('Upload failed');
        }
      }

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
          profileImageUrl: uploadedImageUrl,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (email) {
        setIsOtpSent(true);
        Alert.alert('OTP sent to your email');
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

  const handleSelectImage = () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', includeBase64: false},
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error Code: ', response.errorCode);
          console.log('ImagePicker Error Message: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const source = {uri: response.assets[0].uri || ''};
          setProfileImageUrl(source.uri);
          setImageData(response.assets[0]);
        }
      },
    );
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
          <TouchableOpacity onPress={handleSelectImage}>
            <Image source={{uri: profileImageUrl}} style={styles.avatar} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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
