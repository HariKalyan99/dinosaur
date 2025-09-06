import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput, View } from "react-native";
import CustomHeader from "../common/custom-header";
import CustomSafeAreaView from "../common/custom-safearea-view";
import UploadButton from "../components/uploadDyno/upload-button";
import { Colors } from "../constants/colors";
import { FONTS } from "../constants/Fonts";

interface uriData {
  thumb_uri: string;
  file_uri: string;
}

const UploadDynoSnap: React.FC = () => {
  const data = useRoute();
  const item = data?.params as uriData;
  const [caption, setCaption] = useState<string>('');
  // const {startUpload} = useUpload();

  return (
    <CustomSafeAreaView>
      <CustomHeader title="Upload" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.flexDirectionRow}>
          <Image source={{uri: item?.thumb_uri}} style={styles.img} />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={caption}
            placeholderTextColor={Colors.border}
            onChangeText={setCaption}
            placeholder="Enter your caption here..."
            multiline={true}
            numberOfLines={8}
          />
        </View>
        <UploadButton />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 0,
    marginTop: 30,
    alignItems: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  input: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    color: Colors.text,
    borderRadius: 5,
    fontFamily: FONTS.Medium,
    padding: 10,
    marginVertical: 10,
    width: '68%',
  },
  img: {
    width: '25%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
});

export default UploadDynoSnap;
