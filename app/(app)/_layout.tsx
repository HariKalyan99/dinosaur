import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  // console.log("Is signed in>>>", isSignedIn)

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={"#121212"} />
      </View>
    );
  }

  // safeguard those screens and tabs under the signedin guard
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}