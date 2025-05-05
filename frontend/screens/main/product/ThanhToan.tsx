import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearCart} from '../../../utils/cartStorage';

type Product = {
  _id: string;
  tenSanPham: string;
  hinhAnh: string;
  gia: number;
  quantity: number;
  color?: string;
  size?: string;
};

type RouteParams = {
  params: {
    products: Product[];
  };
};

const ThanhToan = () => {
  const route = useRoute<RouteProp<RouteParams>>();
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [quantities, setQuantities] = useState<{[id: string]: number}>(
    Object.fromEntries(route.params.products.map(p => [p._id, p.quantity])),
  );
  const [discount, setDiscount] = useState<number>(0); // Giá trị giảm giá
  const [discountCode, setDiscountCode] = useState<string>(''); // Tên mã giảm giá

  // Tính tổng tiền trước và sau khi áp dụng mã giảm giá
  const totalBeforeDiscount = route.params.products.reduce(
    (sum, item) => sum + item.gia * quantities[item._id],
    0,
  );
  const totalAfterDiscount =
    totalBeforeDiscount - (totalBeforeDiscount * discount) / 100;

  const handleSelectDiscount = () => {
    navigation.navigate('Discount', {
      onSelect: (selectedDiscount: number, selectedDiscountCode: string) => {
        setDiscount(selectedDiscount);
        setDiscountCode(selectedDiscountCode);
      },
    });
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    const updatedProducts = route.params.products.map(p => ({
      ...p,
      quantity: quantities[p._id],
    }));

    const newOrder = {
      orderId: Date.now().toString(),
      items: updatedProducts,
      total: totalAfterDiscount,
      address,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận',
    };

    try {
      const existing = await AsyncStorage.getItem('orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      await clearCart();
      Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt!');
      navigation.goBack();
    } catch (err) {
      console.error('Lỗi khi lưu đơn hàng:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {route.params.products.map(product => (
        <View key={product._id} style={styles.productCard}>
          <Image source={{uri: product.hinhAnh}} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{product.tenSanPham}</Text>
            {product.color && (
              <View style={styles.colorCircleWrapper}>
                <Text>Màu: </Text>
                <View
                  style={[styles.colorCircle, {backgroundColor: product.color}]}
                />
              </View>
            )}
            <Text>Kích thước: {product.size || 'Không có'}</Text>
            <Text>Giá: {product.gia.toLocaleString()} đ</Text>
            <Text>Số lượng: {quantities[product._id]}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Mã giảm giá:</Text>
      <TouchableOpacity
        style={styles.discountButton}
        onPress={handleSelectDiscount}>
        <Text style={styles.discountButtonText}>
          {discount > 0
            ? `Mã: ${discountCode} - Giảm ${discount}%`
            : 'Chọn mã giảm giá'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Tổng tiền:</Text>
      <Text style={styles.totalText}>
        {totalAfterDiscount.toLocaleString()} đ
      </Text>

      <Text style={styles.sectionTitle}>Địa chỉ giao hàng:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.sectionTitle}>Hình thức thanh toán:</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity onPress={() => setPaymentMethod('cash')}>
          <Text style={paymentMethod === 'cash' ? styles.selected : {}}>
            Tiền mặt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentMethod('card')}>
          <Text style={paymentMethod === 'card' ? styles.selected : {}}>
            Thẻ
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
        <Text style={styles.orderButtonText}>Đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  image: {width: 100, height: 100, borderRadius: 8},
  info: {flex: 1, marginLeft: 12},
  name: {fontSize: 16, fontWeight: 'bold'},
  colorCircleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    width: '50%',
  },
  sectionTitle: {marginTop: 16, fontWeight: 'bold'},
  discountButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  discountButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  selected: {fontWeight: 'bold', color: 'blue'},
  orderButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default ThanhToan;
