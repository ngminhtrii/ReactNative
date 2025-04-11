import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';

const ProductLike = () => {
  const favoriteProducts = [
    {id: '1', name: 'Product A', image: 'https://via.placeholder.com/100'},
    {id: '2', name: 'Product B', image: 'https://via.placeholder.com/100'},
    {id: '3', name: 'Product C', image: 'https://via.placeholder.com/100'},
  ];

  const renderItem = ({
    item,
  }: {
    item: {id: string; name: string; image: string};
  }) => (
    <View style={styles.productContainer}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản Phẩm Yêu Thích</Text>
      <FlatList
        data={favoriteProducts}
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
  },
});

export default ProductLike;
