import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; // Use named import; // Assuming you have a Colors constant file, adjust if not
import { useColorScheme } from '@/components/useColorScheme'; // Standard hook in Expo Router templates

// Define icon type for safety
type IconName = keyof typeof Ionicons.glyphMap;

function TabBarIcon(props: {
  name: IconName;
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Screens will manage their own headers or use Stack headers
      }}>
      <Tabs.Screen
        name="index" // This corresponds to index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="records" // Corresponds to records.tsx (create this file)
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <TabBarIcon name="folder-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="aiAgent" // Corresponds to aiAgent.tsx (create this file)
        options={{
          title: 'AI Agent',
          tabBarIcon: ({ color }) => <TabBarIcon name="hardware-chip-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights" // Corresponds to insights.tsx (create this file)
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <TabBarIcon name="analytics-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Corresponds to profile.tsx (create this file)
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}