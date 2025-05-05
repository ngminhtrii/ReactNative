import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';

type Product = {
  _id: string;
  tenSanPham: string;
  hinhAnh: string;
  gia: number;
  quantity: number;
  color?: string;
  size?: string;
};

type Order = {
  orderId: string;
  createdAt: string;
  total: number;
  status: string;
  items: Product[];
  address: string;
};

type RouteParams = {
  order: Order;
};

const ORDER_STATUS: {[key: string]: string} = {
  pending: '1. Đơn hàng mới',
  confirmed: '2. Đã xác nhận',
  preparing: '3. Đang chuẩn bị hàng',
  shipping: '4. Đang giao hàng',
  delivered: '5. Đã giao thành công',
  cancelled: '6. Đã hủy',
  'cancel-requested': 'Đang yêu cầu hủy',
};

const OrderDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const [order] = useState<Order>(route.params.order);

  const navigateToUpdateStatus = () => {
    navigation.navigate('UpdateOrderStatus', {
      orderId: order.orderId,
      currentStatus: order.status,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Mã đơn hàng: {order.orderId}</Text>
      <Text style={styles.label}>Địa chỉ giao hàng: {order.address}</Text>
      <Text style={styles.label}>
        Tổng tiền: {order.total.toLocaleString()} đ
      </Text>
      <Text style={styles.label}>
        Trạng thái hiện tại: {ORDER_STATUS[order.status]}
      </Text>

      <Text style={styles.sectionTitle}>Chi tiết sản phẩm:</Text>
      {order.items.map(item => (
        <View key={item._id} style={styles.productCard}>
          <Image source={{uri: item.hinhAnh}} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.tenSanPham}</Text>
            <Text>Màu: {item.color || 'Không có'}</Text>
            <Text>Size: {item.size || 'Không có'}</Text>
            <Text>Giá: {item.gia.toLocaleString()} đ</Text>
            <Text>Số lượng: {item.quantity}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  label: {marginBottom: 8, fontSize: 16},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  image: {width: 100, height: 100, borderRadius: 8},
  info: {flex: 1, marginLeft: 12},
  name: {fontSize: 16, fontWeight: 'bold'},
  updateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default OrderDetailScreen;
