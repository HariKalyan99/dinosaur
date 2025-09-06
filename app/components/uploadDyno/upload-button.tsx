import { Colors } from "@/app/constants/colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Text, TouchableOpacity } from "react-native";

interface UploadButtonProps {
  onPress?: () => void;
  title?: string;
}

const UploadButton: FC<UploadButtonProps> = ({ onPress, title = "Upload" }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // default: navigate to hidden upload screen
      router.push("/upload-dyno-snap");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.theme,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
      }}
    >
      <AntDesign name="upload" size={20} color={Colors.white} style={{ marginRight: 8 }} />
      <Text style={{ color: Colors.white, fontWeight: "600", fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default UploadButton;
