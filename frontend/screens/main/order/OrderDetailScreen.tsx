import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';

type Order = {
  orderId: string;
  createdAt: string;
  total: number;
  status: string;
  items: any[];
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
  const [order, setOrder] = useState<Order>(route.params.order);
  const [selectedStatus, setSelectedStatus] = useState<string>(order.status);

  const handleSave = async () => {
    try {
      const data = await AsyncStorage.getItem('orders');
      let orders = data ? JSON.parse(data) : [];

      const updatedOrders = orders.map((o: Order) =>
        o.orderId === order.orderId ? {...o, status: selectedStatus} : o,
      );

      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      Alert.alert('Thành công', 'Trạng thái đơn hàng đã được cập nhật');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể cập nhật đơn hàng');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mã đơn hàng: {order.orderId}</Text>
      <Text style={styles.label}>
        Tổng tiền: {order.total.toLocaleString()} đ
      </Text>
      <Text style={styles.label}>Trạng thái hiện tại:</Text>

      <Picker
        selectedValue={selectedStatus}
        onValueChange={itemValue => setSelectedStatus(itemValue)}>
        {Object.keys(ORDER_STATUS).map(key => (
          <Picker.Item key={key} label={ORDER_STATUS[key]} value={key} />
        ))}
      </Picker>

      <Button title="Cập nhật trạng thái" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  label: {marginBottom: 8, fontSize: 16},
});

export default OrderDetailScreen;
