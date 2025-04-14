import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'CART_ITEMS';

export const getCart = async () => {
  const cart = await AsyncStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = async (newItem: any) => {
  try {
    const existing = await AsyncStorage.getItem('CART_ITEMS');
    let cart = existing ? JSON.parse(existing) : [];

    // Tìm sản phẩm trùng ID + size + color
    const index = cart.findIndex(
      (item: any) =>
        item._id === newItem._id &&
        item.color === newItem.color &&
        item.size === newItem.size,
    );

    if (index !== -1) {
      cart[index].quantity += newItem.quantity;
    } else {
      cart.push(newItem);
    }

    await AsyncStorage.setItem('CART_ITEMS', JSON.stringify(cart));
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
  }
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};
