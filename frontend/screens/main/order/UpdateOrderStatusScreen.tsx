import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';

type RouteParams = {
  orderId: string;
  currentStatus: string;
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

const UpdateOrderStatusScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const {orderId, currentStatus} = route.params;
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);

  const handleSave = async () => {
    try {
      const data = await AsyncStorage.getItem('orders');
      let orders = data ? JSON.parse(data) : [];

      const updatedOrders = orders.map((o: any) =>
        o.orderId === orderId ? {...o, status: selectedStatus} : o,
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
      <Text style={styles.label}>Cập nhật trạng thái đơn hàng</Text>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={itemValue => setSelectedStatus(itemValue)}>
        {Object.keys(ORDER_STATUS).map(key => (
          <Picker.Item key={key} label={ORDER_STATUS[key]} value={key} />
        ))}
      </Picker>
      <Button title="Lưu" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  label: {marginBottom: 8, fontSize: 16, fontWeight: 'bold'},
});

export default UpdateOrderStatusScreen;
