import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const ORDER_STATUS: {[key: string]: string} = {
  pending: '1. Đơn hàng mới',
  confirmed: '2. Đã xác nhận',
  preparing: '3. Đang chuẩn bị hàng',
  shipping: '4. Đang giao hàng',
  delivered: '5. Đã giao thành công',
  cancelled: '6. Đã hủy',
  'cancel-requested': 'Đang yêu cầu hủy',
};

const OrderManagementScreen: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'update'>('list');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const loadOrders = async () => {
    const data = await AsyncStorage.getItem('orders');
    const parsed = data ? JSON.parse(data) : [];
    setOrders(parsed);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setView('detail');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o =>
      o.orderId === selectedOrder.orderId ? {...o, status: selectedStatus} : o,
    );
    await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng');
    setView('detail');
  };

  const renderOrderList = () => (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => handleSelectOrder(item)}>
          <Text style={styles.orderId}>Mã: {item.orderId}</Text>
          <Text>Ngày: {new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text>Trạng thái: {ORDER_STATUS[item.status]}</Text>
          <Text>Tổng tiền: {item.total.toLocaleString()} đ</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderOrderDetail = () => (
    <ScrollView style={{padding: 16}}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      {selectedOrder && (
        <>
          <Text>Mã đơn: {selectedOrder.orderId}</Text>
          <Text>Địa chỉ: {selectedOrder.address}</Text>
          <Text>Trạng thái: {ORDER_STATUS[selectedOrder.status]}</Text>
          <Text>Tổng: {selectedOrder.total.toLocaleString()} đ</Text>

          <Text style={styles.subtitle}>Sản phẩm:</Text>
          {selectedOrder.items.map(item => (
            <View key={item._id} style={styles.productCard}>
              <Image source={{uri: item.hinhAnh}} style={styles.image} />
              <View style={{marginLeft: 10}}>
                <Text>{item.tenSanPham}</Text>
                <Text>Màu: {item.color}</Text>
                <Text>Size: {item.size}</Text>
                <Text>Giá: {item.gia.toLocaleString()} đ</Text>
                <Text>Số lượng: {item.quantity}</Text>
              </View>
            </View>
          ))}
          <Button
            title="Cập nhật trạng thái"
            onPress={() => setView('update')}
          />
          <Button title="Quay lại" onPress={() => setView('list')} />
        </>
      )}
    </ScrollView>
  );

  const renderStatusUpdate = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật trạng thái</Text>
      {Object.entries(ORDER_STATUS).map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.statusButton,
            selectedStatus === key && styles.selectedStatus,
          ]}
          onPress={() => setSelectedStatus(key)}>
          <Text
            style={
              selectedStatus === key ? styles.selectedText : styles.statusText
            }>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
      <Button title="Lưu" onPress={handleUpdateStatus} />
      <Button title="Hủy" onPress={() => setView('detail')} />
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {view === 'list' && renderOrderList()}
      {view === 'detail' && renderOrderDetail()}
      {view === 'update' && renderStatusUpdate()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  subtitle: {fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8},
  orderItem: {
    backgroundColor: '#eee',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  orderId: {fontWeight: 'bold', marginBottom: 4},
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
  },
  image: {width: 80, height: 80, borderRadius: 8},
  statusButton: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  selectedStatus: {
    backgroundColor: '#007bff',
  },
  statusText: {
    color: '#000',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderManagementScreen;
