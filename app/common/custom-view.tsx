import React, { FC, ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";

interface CustomViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomView: FC<CustomViewProps> = ({ children, style }) => {
  return <View className={`flex-1 ${Colors.background}`}>{children}</View>;
};

export default CustomView;
