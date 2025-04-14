import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import authAxios from '../../../utils/authAxios';
import {RouteProp, useRoute} from '@react-navigation/native';

// Kiểu dữ liệu sản phẩm
type Product = {
  _id: string;
  tenSanPham: string;
  gia: number;
  hinhAnh: string;
  moTa: string;
  mauSac: string[];
  kichThuoc: string[];
  soLuong: number;
};

// Định nghĩa Route
type RootStackParamList = {
  ProductDetail: {id: string};
};
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetail = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const {id} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await authAxios.get(`/admin/products/${id}`);
      console.log('Dữ liệu trả về:', res.data); // Log toàn bộ dữ liệu trả về
      setProduct(res.data.product); // Đảm bảo `product` tồn tại trong `res.data`
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect gọi fetchProduct');
    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log('Trạng thái loading:', loading);
    console.log('Dữ liệu sản phẩm:', product);
  }, [loading, product]);

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    console.log('Thêm vào giỏ:', product._id);
    // TODO: Tích hợp Redux hoặc Context để thêm vào giỏ
  };

  const handleBuyNow = () => {
    console.log('Mua ngay:', product._id);
    // TODO: Điều hướng sang màn hình thanh toán
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{uri: product.hinhAnh}} style={styles.image} />
      <Text style={styles.name}>{product.tenSanPham}</Text>
      <Text style={styles.price}>{product.gia.toLocaleString()} đ</Text>
      <Text style={styles.description}>{product.moTa}</Text>

      <Text style={styles.label}>Màu sắc:</Text>
      <View style={styles.colorRow}>
        {product.mauSac.map((color, index) => (
          <View
            key={index}
            style={[styles.colorCircle, {backgroundColor: color}]}
          />
        ))}
      </View>

      <Text style={styles.label}>Kích thước:</Text>
      <View style={styles.sizeRow}>
        {product.kichThuoc.map((size, index) => (
          <View key={index} style={styles.sizeBox}>
            <Text style={styles.sizeText}>{size}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.quantity}>Còn lại: {product.soLuong}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNow} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeText: {
    fontSize: 14,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#555',
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  addToCart: {
    flex: 1,
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  buyNow: {
    flex: 1,
    backgroundColor: '#e53935',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetail;
