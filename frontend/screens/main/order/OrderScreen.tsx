import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Order = {
  orderId: string;
  createdAt: string;
  total: number;
  status: string;
  items: {
    _id: string;
    tenSanPham: string;
    gia: number;
    quantity: number;
    color: string;
    size: string;
  }[];
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

const OrderScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error('Lỗi khi đọc đơn hàng:', error);
    }
  };

  const handleCancel = (order: Order) => {
    const timeCreated = new Date(order.createdAt).getTime();
    const now = Date.now();
    const diffInMinutes = (now - timeCreated) / (1000 * 60);

    if (diffInMinutes < 30 && order.status === 'pending') {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn hủy đơn này?', [
        {text: 'Không'},
        {
          text: 'Có',
          onPress: async () => {
            const updated = orders.map(o =>
              o.orderId === order.orderId ? {...o, status: 'cancelled'} : o,
            );
            await AsyncStorage.setItem('orders', JSON.stringify(updated));
            setOrders(updated);
          },
        },
      ]);
    } else if (order.status === 'preparing') {
      Alert.alert('Yêu cầu hủy', 'Yêu cầu hủy đơn sẽ được gửi đến shop.');
      const updated = orders.map(o =>
        o.orderId === order.orderId ? {...o, status: 'cancel-requested'} : o,
      );
      AsyncStorage.setItem('orders', JSON.stringify(updated));
      setOrders(updated);
    } else {
      Alert.alert(
        'Không thể hủy đơn',
        'Đơn hàng không được phép hủy ở trạng thái này.',
      );
    }
  };

  const renderItem = ({item}: {item: Order}) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderId}>Mã đơn: {item.orderId}</Text>
      <Text style={styles.orderDate}>
        Ngày tạo: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.orderTotal}>
        Tổng tiền: {item.total.toLocaleString()} đ
      </Text>
      <Text style={styles.orderStatus}>
        Trạng thái: {ORDER_STATUS[item.status] || item.status}
      </Text>

      {item.status === 'pending' || item.status === 'preparing' ? (
        <Button
          title={item.status === 'pending' ? 'Hủy đơn' : 'Gửi yêu cầu hủy'}
          onPress={() => handleCancel(item)}
        />
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Chưa có đơn hàng nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  orderContainer: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 12,
  },
  orderId: {fontWeight: 'bold', marginBottom: 4},
  orderDate: {},
  orderTotal: {marginTop: 4, fontWeight: 'bold', color: '#e53935'},
  orderStatus: {marginTop: 4, fontStyle: 'italic'},
});

export default OrderScreen;
