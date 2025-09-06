import { AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
export default function _layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload-dynos"
        options={{
          headerShown: false,
          title: "upload",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" size={size} color={color} />
          ),
        }}
        // listeners={{
        //   tabPress: (e) => {
        //     e.preventDefault();
        //   },
        // }}
      />
      <Tabs.Screen
        name="dyno-shorts"
        options={{
          headerShown: false,
          title: "dyno-shorts",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="videocamera" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
