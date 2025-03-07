import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import config from '../config/config';
import {launchImageLibrary} from 'react-native-image-picker';

axios.defaults.baseURL = config.baseURL;

const AddProductScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('/api/products', {
        name,
        description,
        price: parseFloat(price),
        category,
        brand,
        size: size.split(',').map(s => s.trim()), // Chuyển đổi chuỗi thành mảng
        color: color.split(',').map(c => c.trim()), // Chuyển đổi chuỗi thành mảng
        images, // Sử dụng mảng hình ảnh
      });
      setMessage('Product added successfully');
      navigation.navigate('Home');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred');
      }
    }
  };

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Người dùng đã hủy chọn ảnh.');
      } else if (response.errorMessage) {
        console.log('Lỗi khi chọn ảnh:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImages = response.assets
          .map(asset => asset.uri)
          .filter((uri): uri is string => uri !== undefined);
        setImages([...images, ...selectedImages]);
      }
    });
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
      <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{uri: image}} style={styles.image} />
        ))}
      </View>
      <Button title="Add Product" onPress={handleAddProduct} />
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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default AddProductScreen;
