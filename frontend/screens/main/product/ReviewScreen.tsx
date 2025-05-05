import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  _id: string;
  tenSanPham: string;
  hinhAnh: string;
};

type RootStackParamList = {
  ReviewScreen: {product: Product};
};

const ReviewScreen = ({navigation}: any) => {
  const route = useRoute<RouteProp<RootStackParamList, 'ReviewScreen'>>();
  const {product} = route.params;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment) {
      Alert.alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    // Gửi đánh giá (có thể lưu vào backend hoặc AsyncStorage)
    console.log('Gửi đánh giá:', {
      productId: product._id,
      rating,
      comment,
    });

    // Tạo mã giảm giá
    const discountCode = {
      id: Date.now().toString(),
      code: `DISCOUNT${Math.floor(Math.random() * 1000)}`, // Tạo mã ngẫu nhiên
      description: `Giảm ${rating >= 4 ? '20%' : '10%'} cho các sản phẩm`,
      discount: rating >= 4 ? 20 : 10, // Giảm 20% nếu đánh giá >= 4 sao, ngược lại giảm 10%
    };

    try {
      // Lấy danh sách mã giảm giá hiện tại
      const existingDiscounts = await AsyncStorage.getItem('DISCOUNT_CODES');
      const discounts = existingDiscounts ? JSON.parse(existingDiscounts) : [];

      // Thêm mã giảm giá mới
      discounts.push(discountCode);
      await AsyncStorage.setItem('DISCOUNT_CODES', JSON.stringify(discounts));

      Alert.alert(
        'Cảm ơn bạn đã đánh giá!',
        `Bạn đã nhận được mã giảm giá: ${discountCode.code}`,
      );
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu mã giảm giá:', error);
      Alert.alert('Lỗi', 'Không thể lưu mã giảm giá.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá sản phẩm</Text>
      <Text style={styles.productName}>{product.tenSanPham}</Text>

      <Text style={styles.label}>Số sao (1 - 5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={1}
        value={rating.toString()}
        onChangeText={text => setRating(Number(text))}
      />

      <Text style={styles.label}>Nội dung đánh giá:</Text>
      <TextInput
        style={[styles.input, {height: 100}]}
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  productName: {fontSize: 18, fontWeight: '600', marginBottom: 10},
  label: {fontSize: 16, marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
});

export default ReviewScreen;
