import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Text,
} from 'react-native';

const Header: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../../assets/arrow_back.png')} // Path is correct
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="gray"
      />
      <TouchableOpacity onPress={() => console.log('Notification pressed')}>
        <Image
          source={require('../../../../assets/notifications.png')} // Path is correct
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={{flex: 0.03}}>
        <Text> </Text> {/* Thêm Text để tránh lỗi */}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={{uri: 'https://via.placeholder.com/50'}}
          style={styles.profileImage}
        />
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
    backgroundColor: '#e4e4eb', // Màu nền xanh
    height: 60, // Điều chỉnh chiều cao cho icon hiển thị đúng
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
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
