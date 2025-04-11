import React from 'react';
import {Image, TouchableOpacity, Dimensions, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface ImageType {
  url: string;
  link?: string;
}

interface Props {
  images: ImageType[];
  height: number;
  autoPlay: boolean;
  interval: number;
  showPagination: boolean;
}

const CustomSwipper: React.FC<Props> = ({
  images,
  height,
  autoPlay,
  interval,
  showPagination,
}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={{height}}>
      <Swiper
        autoplay={autoPlay}
        autoplayTimeout={interval / 1000}
        showsPagination={showPagination}
        dotStyle={{backgroundColor: '#ccc'}}
        activeDotStyle={{backgroundColor: 'green'}}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => image.link && navigation.navigate(image.link)}>
            <Image
              source={{uri: image.url}}
              style={{width, height, resizeMode: 'cover'}}
            />
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

export default CustomSwipper;
