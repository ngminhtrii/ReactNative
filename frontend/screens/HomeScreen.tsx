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
import authAxios from '../utils/authAxios';
import CustomSwipper from '../components/Custom/CustomSwipper';
import MainLayout from '../layout/MainLayout';

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await authAxios.get('/admin/products');
      const allProducts = res.data.data || [];

      const sellers = allProducts.filter(
        (p: {soLuong: number}) => p.soLuong < 50,
      );
      const news = allProducts.filter(
        (p: {soLuong: number}) => p.soLuong >= 50,
      );

      setBestSellers(sellers);
      setNewProducts(news);
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

        {/* SẢN PHẨM BÁN CHẠY */}
        <ProductSection
          title="SẢN PHẨM BÁN CHẠY"
          data={bestSellers}
          navigation={navigation}
        />

        {/* SẢN PHẨM MỚI */}
        <ProductSection
          title="SẢN PHẨM MỚI"
          data={newProducts}
          navigation={navigation}
        />
      </ScrollView>
    </MainLayout>
  );
};

const ProductSection = ({title, data, navigation}: any) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.productRow}>
        {data.map((product: any) => (
          <ProductCard
            key={product._id}
            navigation={navigation}
            image={product.hinhAnh}
            name={product.tenSanPham}
            price={`${product.gia.toLocaleString()} đ`}
            colors={product.mauSac}
            productId={product._id}
          />
        ))}
      </View>
    </View>
  );
};

const ProductCard = ({
  navigation,
  image,
  name,
  price,
  colors,
  productId,
}: {
  navigation: any;
  image: string;
  name: string;
  price: string;
  colors: string[];
  productId: string;
}) => {
  return (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetail', {id: productId})}>
      <Image source={{uri: image}} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.productPrice}>{price}</Text>
      <View style={styles.colorRow}>
        {colors?.map((color, index) => (
          <View
            key={index}
            style={[styles.colorCircle, {backgroundColor: color}]}
          />
        ))}
      </View>
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
    marginBottom: 4,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  colorCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
