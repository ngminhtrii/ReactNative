import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import config from '../../../config/config';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type RootStackParamList = {
  ProductDetail: {id: string};
  ProductForm: undefined;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ProductDetail', {id: item._id})}>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.price} đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductForm')}>
        <Text style={styles.addButton}>+ Thêm sản phẩm</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  item: {marginBottom: 16},
  image: {width: '100%', height: 150, borderRadius: 8},
  name: {fontSize: 16, fontWeight: 'bold'},
  addButton: {marginBottom: 10, color: 'blue'},
});

export default ProductList;
