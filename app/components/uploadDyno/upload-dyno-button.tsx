import { Colors } from "@/app/constants/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

const UploadDynoButton: FC = () => {
  const navigate = useRouter();

const handleCamera = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "videos", // ✅ string literal instead of MediaType
      quality: 1,
    });

    if (result.canceled) {
      alert("You didn’t record a video!");
      return;
    }

    const videoUri = result.assets[0].uri;

    const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000,
    });

    navigate.push({
      pathname: "/dyno-shorts",
      params: {
        thumb_uri: thumbnail.uri,
        file_uri: videoUri,
      },
    });
  } catch (err) {
    console.log("Error capturing video or creating thumbnail:", err);
  }
};

  return (
    <View className="flex flex-row justify-between items-center mt-10">
      <TouchableOpacity
        className="flex justify-center items-center p-8 w-[32%] h-100 rounded-xl bg-[#1c1b1b]"
        onPress={handleCamera}
      >
        <Ionicons name="camera-outline" size={25} color={Colors.white} />
        <Text className="text-xs text-white">Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex justify-center items-center p-8 w-[32%] h-100 rounded-xl bg-[#1c1b1b]">
        <AntDesign name="filetext1" size={25} color={Colors.white} />
        <Text className="text-xs text-white">Drafts</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex justify-center items-center p-8 w-[32%] h-100 rounded-xl bg-[#1c1b1b]">
        <AntDesign name="layout" size={25} color={Colors.white} />
        <Text className="text-xs text-white">Templates</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadDynoButton;
