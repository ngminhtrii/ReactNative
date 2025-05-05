import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import authAxios from '../../../utils/authAxios';

const ProductManagementScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const deleteProduct = async (productId: string) => {
    try {
      await authAxios.delete(`/admin/products/${productId}`);
      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId),
      );
      Alert.alert('Thành công', 'Sản phẩm đã được xóa');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
    }
  };
  const [products, setProducts] = useState<
    {
      _id: string;
      hinhAnh: string;
      tenSanPham: string;
      gia: number;
      soLuong: number;
      moTa: string;
      trangThaiKho: string;
      danhGia: number;
      soDanhGia: number;
      mauSac?: string[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await authAxios.get('/admin/products');
      setProducts(
        res.data.data.map((product: any) => ({
          _id: product._id,
          hinhAnh: product.images?.[0]?.url || '',
          tenSanPham: product.name,
          gia: product.price,
          soLuong: product.totalQuantity,
          moTa: product.description,
          trangThaiKho: product.stockStatus,
          danhGia: product.rating,
          soDanhGia: product.numReviews,
          mauSac: product.colors,
          sizes: product.sizes,
        })),
      );
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải danh sách sản phẩm...</Text>
      </View>
    );
  }

  const renderItem = ({item}: any) => (
    <View style={styles.card}>
      <Image source={{uri: item.hinhAnh}} style={styles.image} />
      <Text style={styles.name}>{item.tenSanPham}</Text>
      <Text>Mô tả: {item.moTa}</Text>
      <Text>Giá: {item.gia.toLocaleString()} đ</Text>
      <Text>Số lượng: {item.soLuong}</Text>
      <Text>Kích thước: {item.sizes?.join(', ')}</Text>

      <Text>
        Đánh giá: {item.danhGia} ({item.soDanhGia} đánh giá)
      </Text>
      <View style={{flexDirection: 'row', marginTop: 4, flexWrap: 'wrap'}}>
        <Text style={{marginRight: 6}}>Màu sắc:</Text>
        {item.mauSac?.map((color: string, index: number) => (
          <View
            key={index}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: color,
              marginRight: 6,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate('EditProduct', {
              product: {
                _id: item._id,
                name: item.tenSanPham,
                description: item.moTa,
                price: item.gia.toString(),
                totalQuantity: item.soLuong,
                colors: item.mauSac || [],
                sizes: item.sizes || [],
              },
            })
          }>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              'Xác nhận',
              'Bạn có chắc muốn xóa sản phẩm này?',
              [
                {text: 'Hủy'},
                {text: 'Xóa', onPress: () => deleteProduct(item._id)},
              ],
              {cancelable: true},
            )
          }>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddProduct')}>
        <Text style={styles.addBtnText}>+ Thêm Sản Phẩm</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{paddingBottom: 120}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    width: '48%',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
    width: '48%',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductManagementScreen;
