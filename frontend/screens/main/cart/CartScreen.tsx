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
import {useNavigation} from '@react-navigation/native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const data = await getCart();
    setCartItems(data);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.gia * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
      return;
    }
    navigation.navigate('ThanhToan', {products: cartItems});
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
  },
  image: {width: 80, height: 80, borderRadius: 8},
  details: {flex: 1, marginLeft: 12},
  name: {fontSize: 16, fontWeight: 'bold'},
  total: {fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center'},
});

export default CartScreen;
