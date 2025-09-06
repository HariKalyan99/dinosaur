import { screenHeight, screenWidth } from "@/app/utils/scaling";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { useVideoPlayer } from "expo-video";
import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Video from "react-native-video";
interface DynoProps {
  item: any;
  isVisible: boolean;
  preload: boolean;
}

const Dynos: FC<DynoProps> = ({ item, isVisible, preload }) => {
  const [paused, setPaused] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [showLikeAnim, setShowLikeAnim] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const handleDoubleTapLike = useCallback(() => {
    setShowLikeAnim(true);

    setTimeout(() => {
      setShowLikeAnim(false);
    }, 1200);
  }, []);

  const handleTogglePlay = useCallback(() => {
    let currentState = !paused ? "paused" : "play";
    setIsPaused(!isPaused);
    setPaused(currentState);
    setTimeout(() => {
      if (currentState === "play") setPaused(null);
    }, 700);
  }, [paused, isPaused]);

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      handleTogglePlay();
    })
    .runOnJS(true);

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      handleDoubleTapLike();
    })
    .runOnJS(true);

  useEffect(() => {
    setIsPaused(!isVisible);
    if (!isVisible) {
      setPaused(null);
      setVideoLoaded(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isFocused) {
      setIsPaused(true);
    }
    if (isFocused && isVisible) {
      setIsPaused(false);
    }
  }, [isFocused]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };
  function convertToProxyURL(url: string) {
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }
  const player = useVideoPlayer(
    isVisible || preload ? convertToProxyURL(item.videoUrl) : null,
    (player) => {
      player.loop = true;
      if (!isPaused) player.play();
    }
  );

  // Pause/Resume effect
  useEffect(() => {
    if (!player) return;
    if (isPaused) {
      player.pause();
    } else if (isVisible || preload) {
      player.play();
    }
  }, [isPaused, isVisible, preload, player]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView className="flex-1">
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
          <View style={styles.videoContainer}>
            {!videoLoaded && (
              <Image
                source={{ uri: item?.thumbnailUrl }}
                style={styles.videoContainer}
                contentFit="cover"
              />
            )}

            {isVisible || preload ? (
              <Video
                poster={item.thumbnailUrl}
                posterResizeMode="cover"
                source={
                  isVisible || preload ? { uri: item.videoUrl } : undefined
                }
                bufferConfig={{
                  minBufferMs: 2500,
                  maxBufferMs: 3000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 2500,
                }}
                ignoreSilentSwitch={"ignore"}
                playWhenInactive={false}
                playInBackground={false}
                useTextureView={false}
                controls={false}
                disableFocus={true}
                style={styles.videoContainer}
                paused={isPaused}
                repeat={true}
                hideShutterView
                resizeMode="cover"
                shutterColor="transparent"
                onReadyForDisplay={handleVideoLoad}
              />
            ) : null}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

export default Dynos;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    flexGrow: 1,
    flex: 1,
  },
  playPauseButton: {
    position: "absolute",
    top: "47%",
    bottom: 0,
    left: "44%",
    opacity: 0.7,
  },
  shadow: {
    zIndex: -1,
  },
  lottieContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: screenHeight,
    aspectRatio: 9 / 16,
    flex: 1,
    zIndex: -1,
  },
});
