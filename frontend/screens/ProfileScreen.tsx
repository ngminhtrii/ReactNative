import React, {useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import cloudinaryUpload from '../services/uploads';

axios.defaults.baseURL = 'http://192.168.169.78:3000'; // Ensure this matches your server configuration

const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://via.placeholder.com/150',
  );
  const [imageData, setImageData] = useState<any>(null);

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
        uploadedImageUrl = uploadResponse.secure_url;
      }

      const response = await axios.post('/api/auth/update-profile', {
        userId: 'user-id', // Replace with actual user ID
        profileImageUrl: uploadedImageUrl,
      });
      Alert.alert(response.data.message);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        <Image source={{uri: profileImageUrl}} style={styles.avatar} />
      </TouchableOpacity>
      <Button title="Update Profile" onPress={handleUpdateProfile} />
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
});

export default ProfileScreen;
