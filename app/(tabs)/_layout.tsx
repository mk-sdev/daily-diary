import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notatki',
          tabBarIcon: ({ color }) => (
            <Entypo name="list" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dodaj"
        options={{
          title: 'Dodaj',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="więcej"
        options={{
          title: 'Więcej',
          tabBarIcon: ({ color }) => (
            <Feather name="more-horizontal" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
