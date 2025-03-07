import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text, Alert} from 'react-native';
import axios from 'axios';
import config from '../config/config';

axios.defaults.baseURL = config.baseURL;

const EditProductScreen: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {productId} = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategory(product.category);
        setBrand(product.brand);
        setSize(product.size.join(', '));
        setColor(product.color.join(', '));
        setImages(product.images);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/api/products/${productId}`, {
        name,
        description,
        price: parseFloat(price),
        category,
        brand,
        size: size.split(',').map(s => s.trim()),
        color: color.split(',').map(c => c.trim()),
        images,
      });
      setMessage('Product updated successfully');
      navigation.navigate('ProductDetail', {productId});
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Failed to update product');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Size (comma separated)"
        value={size}
        onChangeText={setSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Color (comma separated)"
        value={color}
        onChangeText={setColor}
      />
      <Button title="Update Product" onPress={handleUpdateProduct} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default EditProductScreen;
