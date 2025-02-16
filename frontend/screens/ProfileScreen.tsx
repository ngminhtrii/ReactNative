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

axios.defaults.baseURL = 'http://192.168.111.78:5000'; // Địa chỉ API của bạn

const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://via.placeholder.com/150',
  );
  const [imageData, setImageData] = useState<any>(null);

  // Hàm mở thư viện ảnh khi nhấn vào ảnh đại diện
  const handleSelectImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
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

  // Cập nhật ảnh đại diện lên server
  const handleUpdateProfile = async () => {
    try {
      let uploadedImageUrl = profileImageUrl;

      if (imageData) {
        const uploadData = new FormData();
        uploadData.append('file', {
          uri: imageData.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });

        const uploadResponse = await cloudinaryUpload(uploadData);
        uploadedImageUrl = uploadResponse.secure_url;
      }

      const response = await axios.post('/api/auth/update-profile', {
        userId: 'user-id', // Thay bằng user ID thực tế
        profileImageUrl: uploadedImageUrl,
      });

      Alert.alert(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      Alert.alert('Lỗi cập nhật', (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        <Image source={{uri: profileImageUrl}} style={styles.avatar} />
      </TouchableOpacity>

      <Button title="Cập nhật ảnh đại diện" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16,
  },
});

export default ProfileScreen;
