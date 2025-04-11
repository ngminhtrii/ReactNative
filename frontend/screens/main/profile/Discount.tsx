import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const Discount = () => {
  const discountCodes = [
    {
      id: '1',
      code: 'DISCOUNT10',
      description: 'Giảm 10% cho đơn hàng đầu tiên',
    },
    {
      id: '2',
      code: 'FREESHIP',
      description: 'Miễn phí vận chuyển cho đơn hàng trên 500,000 VND',
    },
    {id: '3', code: 'SALE50', description: 'Giảm 50% cho sản phẩm thứ hai'},
  ];

  const renderItem = ({
    item,
  }: {
    item: {id: string; code: string; description: string};
  }) => (
    <View style={styles.discountContainer}>
      <Text style={styles.discountCode}>{item.code}</Text>
      <Text style={styles.discountDescription}>{item.description}</Text>
    </View>
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
