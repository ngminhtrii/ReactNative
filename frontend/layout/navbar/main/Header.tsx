import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Text,
} from 'react-native';
import authAxios from '../../../utils/authAxios';

const Header: React.FC<{navigation: any}> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await authAxios.get(`/admin/products?name=${searchQuery}`);
      console.log('Kết quả tìm kiếm:', res.data); // Log dữ liệu trả về
      navigation.navigate('SearchResults', {products: res.data.data}); // Điều hướng đến màn hình kết quả
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../../assets/arrow_back.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch} // Gọi hàm tìm kiếm khi nhấn Enter
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image
          //source={require('../../../../assets/search_icon.png')} // Thêm icon tìm kiếm
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Notification pressed')}>
        <Image
          source={require('../../../../assets/notifications.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={{uri: 'https://via.placeholder.com/50'}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#e4e4eb',
    height: 60,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'gray',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Header;
