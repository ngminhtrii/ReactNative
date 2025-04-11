import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import config from '../config/config';
import Header from '../layout/navbar/main/Header';
import Footer from '../layout/navbar/main/Footer';

axios.defaults.baseURL = config.baseURL;

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
