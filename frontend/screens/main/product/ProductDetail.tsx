import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import authAxios from '../../../utils/authAxios';
import {RouteProp, useRoute} from '@react-navigation/native';
import Footer from '../../../layout/navbar/main/Footer';
import {addToCart} from '../../../utils/cartStorage'; // Import hàm addToCart
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type RootStackParamList = {
  ProductDetail: {id: string};
};
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetail = ({navigation}: any) => {
  const route = useRoute<ProductDetailRouteProp>();
  const {id} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const res = await authAxios.get(`/admin/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert('Thông báo', 'Vui lòng chọn màu sắc và kích thước!');
      return;
    }

    const item = {
      _id: product._id,
      tenSanPham: product.tenSanPham,
      gia: product.gia,
      hinhAnh: product.hinhAnh,
      color: selectedColor,
      size: selectedSize,
      quantity: 1, // Thêm dòng này
    };

    try {
      await addToCart(item); // Lưu sản phẩm vào giỏ hàng
      Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };
  const handleBuyNow = async () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert('Vui lòng chọn màu và kích thước');
      return;
    }

    const order = {
      orderId: Date.now().toString(),
      items: [
        {
          _id: product._id,
          tenSanPham: product.tenSanPham,
          gia: product.gia,
          quantity: 1,
          hinhAnh: product.hinhAnh,
          color: selectedColor,
          size: selectedSize,
        },
      ],
      total: product.gia,
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận',
    };

    try {
      const existing = await AsyncStorage.getItem('orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(order);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      Alert.alert('Thành công', 'Đơn hàng đã được tạo!');
      navigation.navigate('Order'); // nếu có màn OrderScreen
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể tạo đơn hàng.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{uri: product.hinhAnh}} style={styles.image} />
        <Text style={styles.name}>{product.tenSanPham}</Text>
        <Text style={styles.price}>{product.gia.toLocaleString()} đ</Text>
        <Text style={styles.description}>{product.moTa}</Text>

        <Text style={styles.label}>Màu sắc:</Text>
        <View style={styles.colorRow}>
          {product.mauSac.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorCircle,
                {backgroundColor: color},
                selectedColor === color && styles.selectedColorCircle,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <Text style={styles.label}>Kích thước:</Text>
        <View style={styles.sizeRow}>
          {product.kichThuoc.map((size, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.selectedSizeBox,
              ]}
              onPress={() => setSelectedSize(size)}>
              <Text style={styles.sizeText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyNow} onPress={handleBuyNow}>
            <Text style={styles.buttonText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    marginBottom: 60,
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
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: '#000',
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
  selectedSizeBox: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  sizeText: {
    fontSize: 14,
    color: '#fff',
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
