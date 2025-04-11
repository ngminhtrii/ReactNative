import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Button, Alert} from 'react-native';
import axios from 'axios';
import config from '../../../config/config';

axios.defaults.baseURL = config.baseURL;

const ProductDetailScreen: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {productId} = route.params;
  interface Product {
    images: string[];
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    size: string[];
    color: string[];
  }

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/products/${productId}`);
      Alert.alert('Success', 'Product deleted successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: product.images[0]}} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productCategory}>Category: {product.category}</Text>
      <Text style={styles.productBrand}>Brand: {product.brand}</Text>
      <Text style={styles.productSize}>Size: {product.size.join(', ')}</Text>
      <Text style={styles.productColor}>Color: {product.color.join(', ')}</Text>
      <Button
        title="Edit Product"
        onPress={() => navigation.navigate('EditProduct', {productId})}
      />
      <Button
        title="Delete Product"
        onPress={handleDeleteProduct}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    marginBottom: 8,
  },
  productSize: {
    fontSize: 16,
    marginBottom: 8,
  },
  productColor: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProductDetailScreen;
