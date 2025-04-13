import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import CustomSwipper from '../components/Custom/CustomSwipper';
import MainLayout from '../layout/MainLayout';

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SẢN PHẨM BÁN CHẠY</Text>
          <View style={styles.productRow}>
            <ProductCard
              navigation={navigation}
              image="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(2).jpg?alt=media&token=79e7a687-b564-45c2-830e-58a4255de418"
              name="Giày Sandal Nam 7081 - Sandal Nam Quai Ngang Chéo Phối Lót Dán"
              price="1.000.000 đ"
              route="ProductDetail"
              colors={['#000', ['#000', '#D9D9D9']]}
            />
            <ProductCard
              navigation={navigation}
              image="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(3).jpg?alt=media&token=caff3f3a-345f-432b-924f-d167d0a87cc3"
              name="Giày Sneaker Nam 1234 - Sneaker Nam Thời Trang"
              price="1.200.000 đ"
              route="ProductDetail2"
              colors={[['#FF0000', '#000'], '#666']}
            />
          </View>
        </View>

        {/* SẢN PHẨM MỚI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SẢN PHẨM MỚI</Text>
          <View style={styles.productRow}>
            <ProductCard
              navigation={navigation}
              image="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(4).jpg?alt=media&token=e922507e-038b-41b0-82f9-77e5097642f9"
              name="Giày Thể Thao Nam 5678 - Thời Trang, Năng Động"
              price="1.500.000 đ"
              route="ProductDetail3"
              colors={['#008080', ['#FFD700', '#000']]}
            />
            <ProductCard
              navigation={navigation}
              image="https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/5779.jpg?alt=media&token=56db3d67-86f3-4940-829a-34e5016f1525"
              name="Giày Cao Cổ Nam 3456 - Phong Cách, Cá Tính"
              price="1.400.000 đ"
              route="ProductDetail4"
              colors={['#333', '#999']}
            />
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
  colors = [],
}: {
  navigation: any;
  image: string;
  name: string;
  price: string;
  route: string;
  colors?: (string | string[])[];
}) => {
  return (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate(route, {name, image, price})}>
      <Image source={{uri: image}} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.productPrice}>{price}</Text>
      <View style={styles.colorContainer}>
        {colors.map((color, index) =>
          Array.isArray(color) ? (
            <View
              key={index}
              style={[
                styles.colorCircle,
                {backgroundColor: 'transparent', overflow: 'hidden'},
              ]}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: color[0],
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    backgroundColor: color[1],
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                />
              </View>
            </View>
          ) : (
            <View
              key={index}
              style={[styles.colorCircle, {backgroundColor: color}]}
            />
          ),
        )}
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
  },
  colorContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default HomeScreen;
