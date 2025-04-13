import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import config from '../../../config/config';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Định nghĩa kiểu dữ liệu sản phẩm
type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

// Định nghĩa các màn hình và kiểu dữ liệu truyền giữa chúng
type RootStackParamList = {
  ProductDetail: {id: string};
  ProductForm: {product?: Product};
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetail = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {id} = route.params;
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${config.baseURL}/products/${id}`);
      Alert.alert('Xóa thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: product.image}} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text>{product.price} đ</Text>
      <Text>{product.description}</Text>

      <Button
        title="Chỉnh sửa"
        onPress={() => navigation.navigate('ProductForm', {product})}
      />
      <Button title="Xóa" onPress={deleteProduct} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  image: {width: '100%', height: 200, borderRadius: 8},
  name: {fontSize: 20, fontWeight: 'bold', marginVertical: 8},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetail;
