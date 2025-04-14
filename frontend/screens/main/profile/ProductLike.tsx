import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  _id: string;
  tenSanPham: string;
  hinhAnh: string;
};

const ProductLike = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const stored = await AsyncStorage.getItem('favorites');
      const favorites = stored ? JSON.parse(stored) : [];
      setFavoriteProducts(favorites);
    };

    fetchFavorites();
  }, []);

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.productContainer}>
      <Image source={{uri: item.hinhAnh}} style={styles.productImage} />
      <Text style={styles.productName}>{item.tenSanPham}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản Phẩm Yêu Thích</Text>
      <FlatList
        data={favoriteProducts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
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
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
  },
});

export default ProductLike;
