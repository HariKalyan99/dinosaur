import CustomView from "@/app/common/custom-view";
import Dynos from "@/app/components/screenComponents/dynos";
import { screenHeight } from "@/app/utils/scaling";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { debounce } from "lodash";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

interface User {
  id: string;
  username: string;
  avatar: string;
  interests: string[];
}
interface VideoPost {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  author: User;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  createdAt: string;
}

const mockPosts: VideoPost[] = [
  {
    id: "1",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Amazing Tech Review",
    description: "Check out this incredible new gadget! #tech #review",
    author: {
      id: "1",
      username: "techguru",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Technology", "Gaming"],
    },
    likes: 1240,
    comments: 89,
    shares: 45,
    duration: 596,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Epic Basketball Shot",
    description:
      "You won't believe this incredible shot! 🏀 #basketball #amazing",
    author: {
      id: "2",
      username: "sportsfan",
      avatar:
        "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Sports", "Fitness"],
    },
    likes: 2890,
    comments: 156,
    shares: 78,
    duration: 653,
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Cooking Masterclass",
    description: "Learn how to make the perfect pasta! 🍝 #cooking #food",
    author: {
      id: "3",
      username: "chefmaster",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Food", "Art"],
    },
    likes: 1567,
    comments: 234,
    shares: 92,
    duration: 15,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "4",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Travel Vlog: Hidden Paradise",
    description:
      "Found this secret beach in Bali! 🏝️ Who wants the location? Drop a 🌊 in the comments! #travel #bali #paradise #wanderlust",
    author: {
      id: "4",
      username: "wanderlust_sarah",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Travel", "Art"],
    },
    likes: 4521,
    comments: 312,
    shares: 189,
    duration: 15,
    createdAt: "2024-01-15T07:30:00Z",
  },
  {
    id: "5",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Dance Challenge Gone Viral",
    description:
      "This new dance is taking over! Can you do it? Tag me if you try! 💃 #dance #viral #challenge #trending #fyp",
    author: {
      id: "5",
      username: "dancequeenx",
      avatar:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Music", "Art"],
    },
    likes: 8934,
    comments: 567,
    shares: 423,
    duration: 15,
    createdAt: "2024-01-15T06:45:00Z",
  },
  {
    id: "6",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Gaming Setup Tour 2024",
    description:
      "My dream gaming setup is finally complete! 🎮 RTX 4090, 240Hz monitor, custom RGB... What should I upgrade next? #gaming #setup #pc #rgb",
    author: {
      id: "6",
      username: "gamingpro_mike",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Gaming", "Technology"],
    },
    likes: 3456,
    comments: 289,
    shares: 156,
    duration: 15,
    createdAt: "2024-01-15T05:20:00Z",
  },
  {
    id: "7",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Fashion Haul: Spring Collection",
    description:
      "Trying on the latest spring trends! 👗 Which outfit is your favorite? 1, 2, or 3? #fashion #haul #spring #ootd #style",
    author: {
      id: "7",
      username: "fashionista_emma",
      avatar:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Fashion", "Art"],
    },
    likes: 2789,
    comments: 198,
    shares: 87,
    duration: 15,
    createdAt: "2024-01-15T04:10:00Z",
  },
  {
    id: "8",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Morning Workout Routine",
    description:
      "Start your day right! 💪 This 10-minute routine will energize you for the whole day. Save this post! #fitness #workout #morning #motivation #health",
    author: {
      id: "8",
      username: "fitnessguru_alex",
      avatar:
        "https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Fitness", "Sports"],
    },
    likes: 5234,
    comments: 345,
    shares: 267,
    duration: 734,
    createdAt: "2024-01-15T03:30:00Z",
  },
  {
    id: "9",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Comedy Skit: When You Forget Your Password",
    description:
      "We've all been there! 😂 The struggle is real when you can't remember if it's password123 or Password123! #comedy #relatable #funny #tech #meme",
    author: {
      id: "9",
      username: "comedian_jay",
      avatar:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Comedy", "Technology"],
    },
    likes: 6789,
    comments: 456,
    shares: 334,
    duration: 734,
    createdAt: "2024-01-15T02:15:00Z",
  },
  {
    id: "10",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Digital Art Time-lapse",
    description:
      "Creating magic one pixel at a time! ✨ This portrait took me 8 hours to complete. What should I draw next? #art #digital #timelapse #portrait #creative",
    author: {
      id: "10",
      username: "artist_luna",
      avatar:
        "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Art", "Technology"],
    },
    likes: 3912,
    comments: 278,
    shares: 145,
    duration: 15,
    createdAt: "2024-01-15T01:00:00Z",
  },
  {
    id: "11",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Street Food Adventure",
    description:
      "Trying the spiciest noodles in Bangkok! 🔥🍜 My mouth is on fire but it's SO worth it! Would you dare to try? #streetfood #spicy #bangkok #foodie #travel",
    author: {
      id: "11",
      username: "foodie_adventures",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Food", "Travel"],
    },
    likes: 4567,
    comments: 389,
    shares: 234,
    duration: 15,
    createdAt: "2024-01-14T23:45:00Z",
  },
  {
    id: "12",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl:
      "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Life Hack: Phone Photography Tips",
    description:
      "Transform your phone photos with these simple tricks! 📸 No expensive equipment needed. Which tip surprised you the most? #photography #lifehack #phone #tips #creative",
    author: {
      id: "12",
      username: "photo_wizard",
      avatar:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150",
      interests: ["Art", "Technology"],
    },
    likes: 7234,
    comments: 512,
    shares: 398,
    duration: 596,
    createdAt: "2024-01-14T22:30:00Z",
  },
];

interface RouteProp {
  data: any[];
}

const Dynoshorts: FC = () => {
  // const windowWidth = Dimensions.get('window').width;
  // const windowHeight = Dimensions.get('window').height;

  // const dispatch = useAppDispatch();
  const route = useRoute();

  const routeParams = route?.params as RouteProp;

  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<any[]>(mockPosts);
  const [hasMore, setHasMore] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  const onViewableItemsChanged = useRef(
    debounce(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        setCurrentVisibleIndex(viewableItems[0].index || 0);
      }
    }, 100)
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  useEffect(() => {
    if (routeParams?.data) {
      setData(routeParams?.data);
      setOffset(routeParams?.data?.length);
    }
  }, [routeParams?.data]);

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data?.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  };

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    []
  );

  const fetchFeed = useCallback(
    debounce(async (offset: number) => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        // const newData = await dispatch(fetchFeedReel(offset, 8));
        // setOffset(offset + 8);
        // if (newData?.length < 8) {
        //   setHasMore(false);
        // }
        // setData(removeDuplicates([...data, ...newData]));
      } finally {
        setLoading(false);
      }
    }, 200),
    [loading, hasMore, data]
  );
  const renderVideoList = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        // <VideoItem
        //   key={index}
        //   isVisible={index === currentVisibleIndex}
        //   item={item}
        //   preload={Math.abs(currentVisibleIndex + 3) >= index}
        // />
        
        // <View
        //   style={{ backgroundColor: "blue", flex: 1, height: screenHeight }}
        // >
        //  <Image source={{uri: item.thumbnailUrl}} style={{height: screenHeight, width: screenWidth, aspectRatio: 9/16}} resizeMode="cover"/>
        // </View>
        <Dynos
          isVisible={index === currentVisibleIndex}
          item={item}
          preload={Math.abs(currentVisibleIndex + 5) >= index}
        />
      );
    },
    [currentVisibleIndex]
  );

  const keyExtractor = useCallback((item: any) => item?.id.toString(), []);

  const memoizedValue = useMemo(
    () => renderVideoList,
    [currentVisibleIndex, data]
  );
  return (
    <CustomView>
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={memoizedValue}
        windowSize={2}
        onEndReached={async () => {
          console.log("fetching");
          await fetchFeed(offset);
        }}
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        disableIntervalMomentum={true}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
        // ListFooterComponent={() =>
        //   loading ? (
        //     <View style={styles.footer}>
        //       <ActivityIndicator size="small" color={Colors.white} />
        //     </View>
        //   ) : null
        // }
        decelerationRate={"normal"}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      {/* <Image source={Loader} style={styles.thumbnail} />  backup if the video don't show up */}

      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20,
    left: 10,
    zIndex: 99,
  },
  footer: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    position: "absolute",
    zIndex: -2,
    aspectRatio: 9 / 16,
    height: screenHeight,
    width: "100%",
    alignSelf: "center",
    right: 0,
    left: 0,
    resizeMode: "stretch",
    top: 0,
    bottom: 0,
  },
});

export default Dynoshorts;
