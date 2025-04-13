import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from '../layout/navbar/main/Header';
import Footer from '../layout/navbar/main/Footer';

interface Props {
  navigation: any;
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({navigation, children}) => {
  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 120, paddingTop: 80}}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <View style={styles.footerWrapper}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 2,
  },
});

export default MainLayout;
