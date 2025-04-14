import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getCart, clearCart} from '../../../utils/cartStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const navigation = useNavigation();
  const route = useRoute();
  const {selectedDiscount} = route.params || {};

  useEffect(() => {
    if (selectedDiscount) {
      setDiscount(selectedDiscount.discount);
    }
    fetchCart();
  }, [selectedDiscount]);

  const fetchCart = async () => {
    const data = await getCart();
    setCartItems(data);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.gia * item.quantity,
    0,
  );

  const discountedTotal = total - (total * discount) / 100;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
      return;
    }

    const newOrder = {
      orderId: Date.now().toString(),
      items: cartItems,
      total: discountedTotal,
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận',
    };

    try {
      const existing = await AsyncStorage.getItem('orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      Alert.alert('Thành công', 'Đơn hàng đã được tạo!');
      clearCart();
      fetchCart();
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image source={{uri: item.hinhAnh}} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.tenSanPham}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Giá: {item.gia.toLocaleString()} đ</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Tổng: {total.toLocaleString()} đ</Text>
      {discount > 0 && (
        <Text style={styles.discountedTotal}>
          Tổng sau giảm: {discountedTotal.toLocaleString()} đ
        </Text>
      )}
      <TouchableOpacity
        style={styles.selectDiscount}
        onPress={() => navigation.navigate('Discount')}>
        <Text style={styles.selectDiscountText}>Chọn mã giảm giá</Text>
      </TouchableOpacity>
      <Button title="Thanh toán" onPress={handleCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  item: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {width: 80, height: 80, borderRadius: 8},
  details: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  name: {fontSize: 16, fontWeight: 'bold'},
  total: {fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center'},
  discountedTotal: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  selectDiscount: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectDiscountText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CartScreen;
