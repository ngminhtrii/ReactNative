import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

const Header: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/arrow_back.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput style={styles.searchInput} placeholder="Search" />
      <TouchableOpacity onPress={() => console.log('Notification pressed')}>
        <Image
          source={require('../../assets/notifications.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={{flex: 0.03}} /> {/* Thêm View này để tạo khoảng cách */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={{uri: 'https://via.placeholder.com/50'}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const Footer: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../../assets/home.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <Image
          source={require('../../assets/shopping_cart.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.middle}></View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Màu nền trắng
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#e4e4eb', // Màu nền xanh
    height: 60, // Điều chỉnh chiều cao cho icon hiển thị đúng
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
  middle: {
    flex: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#e4e4eb', // Màu nền xanh
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

export default HomeScreen;
