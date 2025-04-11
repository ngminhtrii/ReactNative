import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const Order = () => {
  const orders = [
    {id: '1', date: '2023-01-01', total: '500,000 VND'},
    {id: '2', date: '2023-02-15', total: '1,200,000 VND'},
    {id: '3', date: '2023-03-10', total: '750,000 VND'},
  ];

  const renderItem = ({
    item,
  }: {
    item: {id: string; date: string; total: string};
  }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderText}>Mã Đơn Hàng: {item.id}</Text>
      <Text style={styles.orderText}>Ngày: {item.date}</Text>
      <Text style={styles.orderText}>Tổng: {item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn Hàng Của Tôi</Text>
      <FlatList
        data={orders}
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
  orderContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Order;
