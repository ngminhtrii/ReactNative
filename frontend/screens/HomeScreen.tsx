import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={({size, color}) => (
            <Ionicons name="arrow-back-outline" size={size} color={color} />
          )}
          onPress={() => navigation.goBack()}
        />
        <TextInput style={styles.searchInput} placeholder="Search" />
        <IconButton
          icon={({size, color}) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          )}
          onPress={() => console.log('Notification pressed')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{uri: 'https://via.placeholder.com/50'}}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.middle}></View>
      <View style={styles.footer}></View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default HomeScreen;
