import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home Page</Text>
      </View>
      <View style={styles.middle}></View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Màu nền trắng
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6363c9', // Màu nền xanh
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Màu chữ trắng
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
  loginButton: {
    backgroundColor: '#fff', // Nền màu trắng
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  loginButtonText: {
    color: '#000', // Chữ đen
    fontSize: 16,
    fontWeight: 'bold', // Chữ in đậm
  },
  profileButton: {
    backgroundColor: '#fff', // Nền màu trắng
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
  },
  profileButtonText: {
    color: '#000', // Chữ đen
    fontSize: 16,
    fontWeight: 'bold', // Chữ in đậm
  },
});

export default HomeScreen;
