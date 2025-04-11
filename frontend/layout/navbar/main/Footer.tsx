import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';

const Footer: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../../../../assets/home.png')} // Corrected path
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <Image
          source={require('../../../../assets/shopping_cart.png')} // Corrected path
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
        <Image
          source={require('../../../../assets/add.png')} // Corrected path
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#e4e4eb', // Màu nền xanh
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1, // Ensure it stays above other content
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Footer;
