import { FC, ReactNode } from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";

interface CustomSafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: Colors.background,
  },
});

export default CustomSafeAreaView;
