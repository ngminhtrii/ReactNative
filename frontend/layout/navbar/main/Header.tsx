import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import authAxios from '../../../utils/authAxios';

const Header: React.FC<{navigation: any}> = ({navigation}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://via.placeholder.com/50',
  );

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await authAxios.get('/users/Profile');
        const userAvatar = res.data.user.avatar?.url;
        if (userAvatar) {
          setAvatarUrl(userAvatar);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
        // Giữ nguyên avatar mặc định nếu có lỗi
      }
    };

    fetchAvatar();
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../../assets/arrow_back.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="gray"
      />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={{uri: avatarUrl}} style={styles.profileImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#e4e4eb',
    height: 60,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'gray',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Header;
