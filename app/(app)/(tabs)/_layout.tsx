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
    </Tabs>
  );
}
