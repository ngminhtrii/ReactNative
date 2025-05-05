import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Surface,
  useTheme,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const ProductForm: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [sizes, setSizes] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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

  const handleCreateProduct = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token không tồn tại.');

      const response = await axios.post(
        'http://192.168.2.14:5005/api/admin/products',
        {
          name,
          description,
          price: parseFloat(price),
          totalQuantity: parseInt(totalQuantity),
          colors: selectedColors,
          sizes: sizes.split(',').map(size => size.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Thành công', 'Sản phẩm đã được tạo!');
      console.log('✅ Tạo sản phẩm:', response.data);
    } catch (error: any) {
      console.error('❌ Lỗi tạo sản phẩm:', error);
      const msg = error.response?.data?.message || 'Lỗi không xác định';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card} elevation={4}>
        <Text style={styles.title}>Tạo Sản Phẩm Mới</Text>

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

        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : (
          <Button
            mode="contained"
            onPress={handleCreateProduct}
            style={styles.button}>
            Tạo sản phẩm
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

export default ProductForm;
