import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import CustomSwipper from '../components/Custom/CustomSwipper';
import MainLayout from '../layout/MainLayout';
import config from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/admin/products`);
      setProducts(res.data.products); // Giả sử API trả về danh sách sản phẩm trong `products`
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 120}}
        showsVerticalScrollIndicator={false}>
        <CustomSwipper
          images={[
            {
              url: 'https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc.jpg?alt=media&token=30fda9a4-0580-4f0a-8804-90bc66c92946',
            },
            {
              url: 'https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(1).jpg?alt=media&token=8d01ac71-bcf4-4a81-8a03-2e41dba04e6e',
            },
          ]}
          height={300}
          autoPlay={true}
          interval={3000}
          showPagination={true}
        />

        {/* DANH SÁCH SẢN PHẨM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANH SÁCH SẢN PHẨM</Text>
          <View style={styles.productRow}>
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                navigation={navigation}
                image={product.images[0]?.url || ''}
                name={product.name}
                price={`${product.price} đ`}
                route="ProductDetail"
                productId={product.id}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const ProductCard = ({
  navigation,
  image,
  name,
  price,
  route,
  productId,
}: {
  navigation: any;
  image: string;
  name: string;
  price: string;
  route: string;
  productId: string;
}) => {
  return (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate(route, {id: productId})}>
      <Image source={{uri: image}} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.productPrice}>{price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
