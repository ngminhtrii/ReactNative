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
import {getCart, clearCart, addToCart} from '../../../utils/cartStorage'; // Import các hàm từ cartStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const fetchCart = async () => {
    const data = await getCart();
    console.log('Dữ liệu giỏ hàng:', data); // Log dữ liệu giỏ hàng
    setCartItems(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.gia * item.quantity,
    0,
  );

  const handleRemoveItem = async (itemId: string) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart); // Cập nhật giỏ hàng trong state
    await AsyncStorage.setItem('CART_ITEMS', JSON.stringify(updatedCart)); // Lưu lại giỏ hàng vào AsyncStorage
    Alert.alert('Thông báo', 'Sản phẩm đã được xóa khỏi giỏ hàng!');
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
      return;
    }

    const newOrder = {
      orderId: Date.now().toString(),
      items: cartItems,
      total: total,
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
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveItem(item._id)}>
              <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Tổng: {total.toLocaleString()} đ</Text>
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
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;
