import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Surface,
  useTheme,
} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import authAxios from '../../../utils/authAxios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  totalQuantity: number;
  colors: string[];
  sizes?: string[];
}

interface EditProductScreenProps {
  route: {
    params: {
      product: Product;
    };
  };
}

interface ImageAsset {
  uri: string;
  type: string;
  fileName: string;
}

const colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#000000',
  '#ffffff',
];

const EditProductScreen: React.FC<EditProductScreenProps> = ({route}) => {
  const {product} = route.params;
  const theme = useTheme();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [totalQuantity, setTotalQuantity] = useState(
    product.totalQuantity.toString(),
  );
  const [sizes, setSizes] = useState(product.sizes?.join(', ') || '');
  const [selectedColors, setSelectedColors] = useState(product.colors);
  const [image, setImage] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const handleColorSelect = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else if (selectedColors.length < 2) {
      setSelectedColors([...selectedColors, color]);
    } else {
      Alert.alert('Chỉ được chọn tối đa 2 màu!');
    }
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const picked = response.assets[0];
        if (picked.uri && picked.type && picked.fileName) {
          setImage({
            uri: picked.uri,
            type: picked.type,
            fileName: picked.fileName,
          });
        }
      }
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Chuẩn bị payload đầy đủ cho PUT
      const updatePayload = {
        name,
        description,
        price,
        totalQuantity: parseInt(totalQuantity, 10),
        colors: selectedColors,
        sizes: sizes.split(',').map(size => size.trim()),
      };

      await authAxios.put(`/admin/products/${product._id}`, updatePayload);

      if (image) {
        const formData = new FormData();
        formData.append('images', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        } as any);

        await authAxios.post(`/admin/images/product/${product._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      Alert.alert('Thành công', 'Sản phẩm đã được cập nhật.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card} elevation={4}>
        <Text style={styles.title}>Chỉnh sửa sản phẩm</Text>

        <TextInput
          label="Tên sản phẩm"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Mô tả"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Giá"
          mode="outlined"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Tổng số lượng"
          mode="outlined"
          value={totalQuantity}
          onChangeText={setTotalQuantity}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Kích thước (cách nhau bằng dấu phẩy)"
          mode="outlined"
          value={sizes}
          onChangeText={setSizes}
          style={styles.input}
        />
        <Text style={styles.label}>Chọn màu (tối đa 2):</Text>
        <View style={styles.colorContainer}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                {backgroundColor: color},
                selectedColors.includes(color) && styles.selectedColor,
              ]}
              onPress={() => handleColorSelect(color)}
            />
          ))}
        </View>

        <Button mode="outlined" onPress={pickImage}>
          Chọn ảnh
        </Button>

        {image && (
          <Image
            source={{uri: image.uri}}
            style={{
              width: 100,
              height: 100,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
        )}

        {loading ? (
          <ActivityIndicator animating color={theme.colors.primary} />
        ) : (
          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Cập nhật
          </Button>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F0F2F5',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
  },
});

export default EditProductScreen;
