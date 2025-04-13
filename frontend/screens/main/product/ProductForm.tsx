import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  // Removed Picker as it is no longer part of react-native
} from 'react-native';
import axios from 'axios';
import config from '../../../config/config';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

type Product = {
  _id?: string;
  name: string;
  price: string;
  image: string;
  description: string;
  colors: string[]; // Mảng các màu sắc
};

type RootStackParamList = {
  ProductForm: {product?: Product};
};

const ProductForm = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductForm'>>();
  const navigation = useNavigation();
  const product = route.params?.product;

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [image, setImage] = useState(product?.image || '');
  const [description, setDescription] = useState(product?.description || '');
  const [colors, setColors] = useState(product?.colors || []); // Quản lý màu sắc

  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri || '');
    }
  };

  // Thêm hoặc xóa màu sắc vào danh sách
  const toggleColor = (color: string) => {
    setColors(prevColors => {
      if (prevColors.includes(color)) {
        return prevColors.filter(c => c !== color);
      } else {
        return [...prevColors, color];
      }
    });
  };

  const handleSubmit = async () => {
    const data = {name, price: Number(price), image, description, colors};
    try {
      if (product?._id) {
        await axios.put(`${config.baseURL}/products/${product._id}`, data);
        Alert.alert('Cập nhật thành công');
      } else {
        await axios.post(`${config.baseURL}/products`, data);
        Alert.alert('Thêm sản phẩm thành công');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu sản phẩm:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Tên sản phẩm</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text>Giá</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text>Ảnh</Text>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      {image ? <Image source={{uri: image}} style={styles.preview} /> : null}
      <Text>Mô tả</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Text>Chọn màu sắc</Text>
      <View style={styles.colorPicker}>
        {['Red', 'Blue', 'Green', 'Black'].map(color => (
          <Button
            key={color}
            title={color}
            onPress={() => toggleColor(color)}
            color={colors.includes(color) ? color.toLowerCase() : 'gray'}
          />
        ))}
      </View>
      <Button
        title={product ? 'Cập nhật' : 'Thêm sản phẩm'}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  preview: {width: '100%', height: 200, marginVertical: 12, borderRadius: 8},
  colorPicker: {flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8},
});

export default ProductForm;
