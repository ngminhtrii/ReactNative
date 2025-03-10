import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
import {launchImageLibrary} from 'react-native-image-picker';

axios.defaults.baseURL = config.baseURL;

const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [user, setUser] = useState<{
    image: string;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: {Authorization: `Bearer ${token}`},
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put('/api/users/me', user, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setMessage('Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        if (selectedImage) {
          setUser(prevUser =>
            prevUser ? {...prevUser, image: selectedImage} : null,
          );
        }
      }
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        <Image
          source={{uri: user.image || 'https://via.placeholder.com/100'}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={user.name}
        onChangeText={name => setUser({...user, name})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={email => setUser({...user, email})}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={user.phone}
        onChangeText={phone => setUser({...user, phone})}
        keyboardType="phone-pad"
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});

export default ProfileScreen;
