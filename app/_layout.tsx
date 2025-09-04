import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import React from "react";
import "react-native-gesture-handler";

import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

const _layout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GestureHandlerRootView className="flex-1">
        <StatusBar
          translucent={Platform.OS === "ios"}
          backgroundColor={"transparent"}
        />
        <Slot />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};

export default _layout;
