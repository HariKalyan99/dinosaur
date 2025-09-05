import CustomHeader from "@/app/common/custom-header";
import CustomSafeAreaView from "@/app/common/custom-safearea-view";
import CustomView from "@/app/common/custom-view";
import RecentDynoButton from "@/app/components/recentDyno/recent-dyno-button";
import UploadDynoButton from "@/app/components/uploadDyno/upload-dyno-button";
import { Colors } from "@/app/constants/colors";
import { screenHeight } from "@/app/utils/scaling";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import { FlatList } from "react-native-gesture-handler";

interface VideoProp {
  uri: string;
  playableDuration: number;
}

const useGallery = ({ pageSize = 30 }) => { // this will refetch again and again on the count defined when scrolled up
  const [videos, setVideos] = useState<VideoProp[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [permissionNotGranted, setPermissionGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadNextPagePictures = async () => {
    if (!hasNextPage) return;

    try {
      setIsLoadingNextPage(true);
      const videoData = await CameraRoll.getPhotos({
        first: pageSize,
        after: nextCursor,
        assetType: "Videos",
        include: [
          "playableDuration",
          "fileSize",
          "filename",
          "fileExtension",
          "imageSize",
        ],
      });

      const videoExtracted = videoData?.edges?.map((edge) => ({
        uri: edge.node.image.uri,
        playableDuration: edge.node.image.playableDuration,
        filepath: edge.node.image.filepath,
        filename: edge.node.image.filename,
        extension: edge.node.image.extension,
      }));

      setVideos((prev) => [...prev, ...videoExtracted]);
      setNextCursor(videoData.page_info.end_cursor);
      setHasNextPage(videoData.page_info.has_next_page);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An Error occured while fetching videos");
    } finally {
      setIsLoadingNextPage(false);
    }
  };

  const hasAndroidPermission = async () => {
    // Perform your Android permission checks here
    // Example:
    if ((Platform.Version as number) >= 33) {
      const statuses = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      return (
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.CAMERA] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    await loadNextPagePictures();
    setIsLoading(false);
  };
  const fetchInitial = async () => {
    const hasPermission = await hasAndroidPermission();
    if (!hasPermission) {
      setPermissionGranted(true);
    } else {
      setIsLoading(true);
      await loadNextPagePictures();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === "ios") {
      fetchVideos();
    } else {
      fetchInitial();
    }
  }, []);

  return {
    videos,
    loadNextPagePictures,
    isLoading,
    permissionNotGranted,
    isLoadingNextPage,
    hasNextPage,
  };
};

export const convertDurationToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};




const UploadDynos = () => {
  const {
    videos,
    loadNextPagePictures,
    isLoading,
    permissionNotGranted,
    isLoadingNextPage,
    hasNextPage,
  } = useGallery({ pageSize: 30 });

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleVideoSelect = async (data: any) => {
  const { uri } = data;

  const navigate = useRouter();

  if (Platform.OS === "android") {
    createThumbnail({
      url: uri || "",
      timeStamp: 100,
    })
      .then((response) => {
        console.log(response);

        navigate.push({
          pathname: "/dyno-shorts",
          params: {
            thumb_uri: response.path,
            file_uri: uri,
          },
        });
      })
      .catch((err) => {
        console.error("Thumbnail generation error", err);
      });
    return;
  }
  const fileData = await CameraRoll.iosGetImageDataById(uri);
  createThumbnail({
    url: fileData?.node?.image?.filepath || "",
    timeStamp: 100,
  })
    .then((response) => {
      console.log(response);
      navigate.push({
        pathname: "/dyno-shorts",
        params: {
          thumb_uri: response.path,
          file_uri: uri,
        },
      });
    })
    .catch((err) => {
      console.error("Thumbnail generation error", err); // thumbnail generation error
    });
};

const renderItem = ({ item }: { item: VideoProp }) => {
  return (
    <TouchableOpacity style={styles.videoItem} onPress={() => handleVideoSelect(item)}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <Text style={styles.time} className="font-semibold text-white">
        {convertDurationToMMSS(item?.playableDuration)}
        {/* time */}
      </Text>
    </TouchableOpacity>
  );
};

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="small" color={Colors.theme} />;
  };
  return (
    <CustomView>
      <CustomSafeAreaView>
        <CustomHeader title="Upload Dyno" />

        <UploadDynoButton />
        <RecentDynoButton />

        {permissionNotGranted ? (
          <View style={styles.permissionDeniedContainer}>
            <Text className="font-medium text-white text-2xl text-center">
              We need permission to access your gallery.
            </Text>
            <TouchableOpacity onPress={handleOpenSettings}>
              <Text style={styles.permissionButton} className="font-medium">
                Open settings
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <FlatList
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                onEndReached={loadNextPagePictures}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
              />
            )}
          </>
        )}
      </CustomSafeAreaView>
    </CustomView>
  );
};

export default UploadDynos;

const styles = StyleSheet.create({
  pad: {
    padding: 8,
  },
  margin: {
    margin: 10,
  },
  flexRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    margin: 8,
    marginTop: 20,
  },
  videoItem: {
    width: "33%",
    height: screenHeight * 0.28,
    overflow: "hidden",
    margin: 2,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  permissionButton: {
    marginTop: 16,
    color: Colors.theme,
  },
  time: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.02)",
    bottom: 3,
    right: 3,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
