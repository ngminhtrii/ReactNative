// screens/ReviewScreen.tsx
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

  const handleSubmit = () => {
    if (!comment) {
      Alert.alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    // Bạn có thể lưu vào backend hoặc AsyncStorage
    console.log('Gửi đánh giá:', {
      productId: product._id,
      rating,
      comment,
    });

    Alert.alert('Cảm ơn bạn đã đánh giá!');
    navigation.goBack();
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
