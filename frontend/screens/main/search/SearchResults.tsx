import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const SearchResults = ({route, navigation}: any) => {
  const {products} = route.params;

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text>Không tìm thấy sản phẩm nào</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.productContainer}
              onPress={() =>
                navigation.navigate('ProductDetail', {id: item._id})
              }>
              <Image source={{uri: item.hinhAnh}} style={styles.productImage} />
              <Text style={styles.productName}>{item.tenSanPham}</Text>
              <Text style={styles.productPrice}>
                {item.gia.toLocaleString()} đ
              </Text>
              {/* Hiển thị màu sắc */}
              <View style={styles.colorRow}>
                {item.mauSac.map((color: string, index: number) => (
                  <View
                    key={index}
                    style={[styles.colorCircle, {backgroundColor: color}]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  productContainer: {
    marginBottom: 16,
    alignItems: 'center', // Căn giữa nội dung
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center', // Căn giữa tên sản phẩm
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center', // Căn giữa giá tiền
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center', // Căn giữa màu sắc
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default SearchResults;
