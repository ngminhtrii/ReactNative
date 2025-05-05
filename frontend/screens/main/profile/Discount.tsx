import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const Discount = () => {
  const [discountCodes, setDiscountCodes] = useState<
    {id: string; code: string; description: string; discount: number}[]
  >([]);
  const navigation = useNavigation();
  const route = useRoute();
  const {onSelect} = route.params || {}; // lấy callback
  const fetchDiscounts = async () => {
    try {
      const discounts = await AsyncStorage.getItem('DISCOUNT_CODES');
      setDiscountCodes(discounts ? JSON.parse(discounts) : []);
    } catch (error) {
      console.error('Lỗi khi tải mã giảm giá:', error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSelectDiscount = async (discount: any) => {
    try {
      // Xóa mã giảm giá đã sử dụng
      const updatedDiscounts = discountCodes.filter(
        item => item.id !== discount.id,
      );
      await AsyncStorage.setItem(
        'DISCOUNT_CODES',
        JSON.stringify(updatedDiscounts),
      );
      setDiscountCodes(updatedDiscounts);

      Alert.alert('Thông báo', `Bạn đã chọn mã giảm giá: ${discount.code}`);

      // ✅ Gọi callback
      if (onSelect) {
        onSelect(discount.discount, discount.code);
      }

      // ✅ Quay lại màn trước
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi sử dụng mã giảm giá:', error);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {id: string; code: string; description: string; discount: number};
  }) => (
    <TouchableOpacity
      style={styles.discountContainer}
      onPress={() => handleSelectDiscount(item)}>
      <Text style={styles.discountCode}>{item.code}</Text>
      <Text style={styles.discountDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mã Giảm Giá</Text>
      <FlatList
        data={discountCodes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  discountContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  discountCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  discountDescription: {
    fontSize: 16,
  },
});

export default Discount;
