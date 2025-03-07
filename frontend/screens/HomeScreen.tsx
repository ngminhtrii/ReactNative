import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Text,
  FlatList,
} from 'react-native';
import axios from 'axios';
import config from '../config/config';

axios.defaults.baseURL = config.baseURL;

const Header: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/arrow_back.png')}
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
          source={require('../../assets/notifications.png')}
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
      <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
        <Image source={require('../../assets/add.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {_id: string; images: string[]; name: string};
  }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() =>
        navigation.navigate('ProductDetail', {productId: item._id})
      }>
      <Image source={{uri: item.images[0]}} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.productList}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
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
  productList: {
    padding: 16,
  },
  productContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
