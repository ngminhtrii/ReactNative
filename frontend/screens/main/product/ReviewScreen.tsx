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
  ReviewScreen: {
    product: Product;
    onReviewComplete: () => void;
  };
};

const ReviewScreen = ({navigation}: any) => {
  const route = useRoute<RouteProp<RootStackParamList, 'ReviewScreen'>>();
  const {product, onReviewComplete} = route.params;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment) {
      Alert.alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      const reviewed = await AsyncStorage.getItem('REVIEWED_PRODUCTS');
      const reviewedProducts = reviewed ? JSON.parse(reviewed) : [];

      if (reviewedProducts.includes(product._id)) {
        Alert.alert('Bạn đã đánh giá sản phẩm này rồi.');
        return;
      }

      console.log('Gửi đánh giá:', {
        productId: product._id,
        rating,
        comment,
      });

      reviewedProducts.push(product._id);
      await AsyncStorage.setItem(
        'REVIEWED_PRODUCTS',
        JSON.stringify(reviewedProducts),
      );

      const discountCode = {
        id: Date.now().toString(),
        code: `DISCOUNT${Math.floor(Math.random() * 1000)}`,
        description: `Giảm ${rating >= 4 ? '20%' : '10%'} cho các sản phẩm`,
        discount: rating >= 4 ? 20 : 10,
      };

      const existingDiscounts = await AsyncStorage.getItem('DISCOUNT_CODES');
      const discounts = existingDiscounts ? JSON.parse(existingDiscounts) : [];
      discounts.push(discountCode);
      await AsyncStorage.setItem('DISCOUNT_CODES', JSON.stringify(discounts));

      Alert.alert(
        'Cảm ơn bạn đã đánh giá!',
        `Bạn đã nhận được mã giảm giá: ${discountCode.code}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onReviewComplete) {
                onReviewComplete(); // Gọi callback để đánh dấu đơn hàng đã đánh giá
              }
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      Alert.alert('Lỗi', 'Không thể xử lý đánh giá.');
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
