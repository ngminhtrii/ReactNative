import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

type Order = {
  orderId: string;
  createdAt: string;
  total: number;
  status: string;
  address: string;
  items: {
    _id: string;
    tenSanPham: string;
    gia: number;
    quantity: number;
    color: string;
    size: string;
    hinhAnh?: string;
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

type RootStackParamList = {
  OrderDetail: {order: Order};
};

const COLOR_MAP: {[key: string]: string} = {
  '#ffffff': 'Trắng',
  '#000000': 'Đen',
  '#ff0000': 'Đỏ',
  '#00ff00': 'Xanh lá',
  '#0000ff': 'Xanh dương',
  '#ffff00': 'Vàng',
  '#ff69b4': 'Hồng',
};

const getColorName = (hex: string): string => {
  return COLOR_MAP[hex.toLowerCase()] || hex;
};

const OrderScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [orders, setOrders] = useState<Order[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  const fetchOrders = async () => {
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        const ordersData = JSON.parse(storedOrders);
        const updatedOrders = ordersData.map((order: Order) => {
          const timeCreated = new Date(order.createdAt).getTime();
          const now = Date.now();
          const diffInMinutes = (now - timeCreated) / (1000 * 60);

          if (order.status === 'pending' && diffInMinutes >= 30) {
            order.status = 'confirmed';
          }
          return order;
        });
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Lỗi khi đọc đơn hàng:', error);
    }
  };

  const handleUpdateStatus = (order: Order, newStatus: string) => {
    const updated = orders.map(o =>
      o.orderId === order.orderId ? {...o, status: newStatus} : o,
    );
    AsyncStorage.setItem('orders', JSON.stringify(updated));
    setOrders(updated);
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
            handleUpdateStatus(order, 'cancelled');
          },
        },
      ]);
    } else if (order.status === 'preparing') {
      Alert.alert('Yêu cầu hủy', 'Yêu cầu hủy đơn sẽ được gửi đến shop.');
      handleUpdateStatus(order, 'cancel-requested');
    } else {
      Alert.alert(
        'Không thể hủy đơn',
        'Đơn hàng không được phép hủy ở trạng thái này.',
      );
    }
  };

  const renderItem = ({item}: {item: Order}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetail', {order: item})}>
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
        <Text style={styles.orderAddress}>Địa chỉ: {item.address}</Text>

        <Text style={styles.sectionTitle}></Text>
        {item.items.map(item => (
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
      </View>
    </TouchableOpacity>
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
  orderAddress: {marginTop: 6, fontStyle: 'italic', color: '#444'},

  productItem: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
  },
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
});

export default OrderScreen;
