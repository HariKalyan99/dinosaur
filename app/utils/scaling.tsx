import { Dimensions, PixelRatio } from "react-native";
import { scale } from 'react-native-size-matters';

export const normalizeWidth = (size: number): number => {
  return PixelRatio.roundToNearestPixel(scale(size));
};

export const screenWidth: number = Dimensions.get('window').width;
export const screenHeight: number = Dimensions.get('window').height;