import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Profile = () => {
  const profileData = {
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Cá Nhân</Text>
      <Text style={styles.field}>Họ và Tên: {profileData.name}</Text>
      <Text style={styles.field}>Email: {profileData.email}</Text>
      <Text style={styles.field}>Số Điện Thoại: {profileData.phone}</Text>
      <Text style={styles.field}>Địa Chỉ: {profileData.address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  field: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Profile;
