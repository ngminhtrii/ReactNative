import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ProfileUser from './ProfileUser';
import Discount from './Discount';
import ProductLike from './ProductLike';
import Order from './Order';

type MenuOption = {
  id: string;
  title: string;
};

const HomeProfile = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('1'); // Default to "Thông tin cá nhân"

  const menuOptions = [
    {id: '1', title: 'Thông tin cá nhân'},
    {id: '2', title: 'Đơn hàng của tôi'},
    {id: '3', title: 'Sản phẩm yêu thích'},
    {id: '4', title: 'Mã giảm giá'},
  ];

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleOptionPress = (id: string) => {
    setSelectedOption(id);
    setMenuVisible(false); // Close the menu after selection
  };

  const renderMenuItem = ({item}: {item: MenuOption}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleOptionPress(item.id)}>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case '1':
        return <ProfileUser />;
      case '2':
        return <Order />;
      case '3':
        return <ProductLike />;
      case '4':
        return <Discount />;
      default:
        return <ProfileUser />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require('../../../../assets/menu.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      {isMenuVisible && (
        <FlatList
          data={menuOptions}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.menuList}
        />
      )}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
});

export default HomeProfile;
