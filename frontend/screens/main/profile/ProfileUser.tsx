import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import authAxios from '../../../utils/authAxios';
import Icon from 'react-native-vector-icons/Feather';

type ProfileData = {
  avatar?: {
    url: string;
    public_id: string;
  };
  name?: string;
  email?: string;
  phone?: string;
};

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('15a số 6 Bình Chánh Bình Dương');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/users/Profile');
      const user = res.data.user;
      setProfileData(user);
      setPhone(user.phone || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAvatar = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      async response => {
        if (
          response.didCancel ||
          !response.assets ||
          response.assets.length === 0
        )
          return;

        const image = response.assets[0];

        const formData = new FormData();
        formData.append('avatar', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'avatar.jpg',
        });

        try {
          setUploading(true);
          const res = await authAxios.post('/images/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          await fetchProfile();
          Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
        } catch (error) {
          console.error('Upload error:', error);
          Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
        } finally {
          setUploading(false);
        }
      },
    );
  };

  const handleSave = () => {
    // Lưu cục bộ thôi, không gọi API
    setProfileData(prev => (prev ? {...prev, phone} : prev));
    setIsEditing(false);
    Alert.alert('Thông tin đã được lưu thành công');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChooseAvatar}>
        <View style={styles.avatarContainer}>
          {profileData?.avatar?.url ? (
            <Image
              source={{uri: profileData.avatar.url}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.placeholder}>
              <Icon name="user" size={40} color="#aaa" />
            </View>
          )}
          {uploading && <ActivityIndicator style={styles.uploadingIndicator} />}
        </View>
        <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Họ tên:</Text>
        <Text style={styles.value}>{profileData?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profileData?.email}</Text>

        <Text style={styles.label}>Số điện thoại:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{phone || '0816288550'}</Text>
        )}

        <Text style={styles.label}>Địa chỉ:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        ) : (
          <Text style={styles.value}>{address}</Text>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.editButtonText}>
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarText: {
    textAlign: 'center',
    color: '#007bff',
    marginTop: 8,
  },
  infoSection: {
    marginTop: 30,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
