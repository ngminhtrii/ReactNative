import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import ProductManagement from './product/ProductManagementScreen';
import OrderManagement from './order/OrderManagementScreen';

type MenuOption = {
  id: string;
  title: string;
};

const AdminMenuScreen = ({navigation}: {navigation: any}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('1'); // Default: Quản lý sản phẩm

  const menuOptions: MenuOption[] = [
    {id: '1', title: 'Quản lý sản phẩm'},
    {id: '2', title: 'Quản lý đơn hàng'},
  ];

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleOptionPress = (id: string) => {
    setSelectedOption(id);
    setMenuVisible(false);
  };

  const renderMenuItem = ({item}: {item: MenuOption}) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        selectedOption === item.id && styles.selectedMenuItem,
      ]}
      onPress={() => handleOptionPress(item.id)}>
      <Text
        style={[
          styles.menuText,
          selectedOption === item.id && styles.selectedMenuText,
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case '1':
        return <ProductManagement navigation={navigation} />;
      case '2':
        return <OrderManagement />;
      default:
        return null;
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={require('../../../assets/menu.png')}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Manager</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 80,
    paddingBottom: 60,
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
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuList: {
    marginBottom: 10,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  selectedMenuItem: {
    backgroundColor: '#007bff',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMenuText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default AdminMenuScreen;
