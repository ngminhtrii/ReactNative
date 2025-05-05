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
import {RouteProp} from '@react-navigation/native';
import Footer from '../../../layout/navbar/main/Footer';
import {addToCart} from '../../../utils/cartStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  _id: string;
  name: string;
  price: number;
  images: {url: string; isMain: boolean}[];
  description: string;
  colors: string[];
  totalQuantity: number;
  sizes: string[];
};

type RootStackParamList = {
  ProductDetail: {id: string; selectedDiscount?: {discount: number}};
};
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetail = ({navigation, route}: any) => {
  const [quantity, setQuantity] = useState(1);
  const {id, selectedDiscount} = route.params || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await authAxios.get(`/admin/products/${id}`);
      setProduct(res.data.product);
      checkFavorite(res.data.product._id);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  const checkFavorite = async (productId: string) => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    setIsFavorite(favorites.some((item: Product) => item._id === productId));
  };

  const toggleFavorite = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const favorites = stored ? JSON.parse(stored) : [];

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (item: Product) => item._id !== product!._id,
      );
      Alert.alert('Thông báo', 'Đã xóa khỏi danh sách yêu thích.');
    } else {
      updatedFavorites = [...favorites, product];
      Alert.alert('Thông báo', 'Đã thêm vào danh sách yêu thích.');
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedDiscount) {
      setDiscount(selectedDiscount.discount);
    }
  }, [selectedDiscount]);

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  const mainImage = product.images.find(img => img.isMain)?.url;

  const handleAddToCart = async () => {
    if (!selectedColor) {
      Alert.alert('Thông báo', 'Vui lòng chọn màu sắc!');
      return;
    }

    const item = {
      _id: product._id,
      tenSanPham: product.name,
      gia: product.price,
      hinhAnh: mainImage,
      color: selectedColor,
      sizes: selectedSize,
      quantity: quantity,
    };

    try {
      await addToCart(item);
      Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      Alert.alert('Vui lòng chọn màu!');
      return;
    }

    navigation.navigate('ThanhToan', {
      products: [
        {
          _id: product._id,
          tenSanPham: product.name,
          gia: product.price,
          hinhAnh: mainImage,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{uri: mainImage}} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          Giá: {product.price.toLocaleString()} đ
        </Text>
        {discount > 0 && (
          <Text style={styles.discountedPrice}>
            Giá sau giảm:{' '}
            {(
              product.price -
              (product.price * discount) / 100
            ).toLocaleString()}{' '}
            đ
          </Text>
        )}
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.label}>Kích thước:</Text>
        <View style={styles.sizeRow}>
          {product.sizes.map((size, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.selectedSizeBox,
              ]}
              onPress={() => setSelectedSize(size)}>
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText,
                ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Màu sắc:</Text>
        <View style={styles.colorRow}>
          {product.colors.map((color, index) => (
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
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Số lượng:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={decreaseQuantity}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {backgroundColor: isFavorite ? '#888' : '#1976d2'},
          ]}
          onPress={toggleFavorite}>
          <Text style={styles.selectDiscountText}>
            {isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          </Text>
        </TouchableOpacity>

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
    paddingBottom: 120,
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
  discountedPrice: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
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
  selectDiscount: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectDiscountText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
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
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sizeBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSizeBox: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeText: {
    fontWeight: 'bold',
    color: '#000',
  },
  quantityContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
});

export default ProductDetail;
