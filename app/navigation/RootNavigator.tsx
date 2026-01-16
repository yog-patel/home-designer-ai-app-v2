import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { UploadPhotoScreen } from '../screens/UploadPhotoScreen';
import RoomTypeScreen from '../screens/RoomTypeScreen';
import SelectStyleScreen from '../screens/SelectStyleScreen';
import SelectPaletteScreen from '../screens/SelectPaletteScreen';
import GenerateDesignScreen from '../screens/GenerateDesignScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Navigation Param Types
export type TabParamList = {
  Home: undefined;
  Gallery: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  HomeTabs: undefined;
  Upload: { action?: string };
  RoomType: { imageUri: string; action?: string };
  SelectStyle: { imageUri: string; roomType: string; action?: string };
  SelectPalette: { imageUri: string; roomType: string; style: string; palette: string; customPrompt?: string; action?: string };
  GenerateDesign: { imageUri: string; roomType: string; style: string; palette: string; customPrompt?: string; action?: string };
  ImageDetail: { imageUrl: string; roomType: string; style: string; palette: string; createdAt: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wrench" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Designs',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="layers" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator for Design Flow
function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="Upload" component={UploadPhotoScreen} />
      <Stack.Screen name="RoomType" component={RoomTypeScreen} />
      <Stack.Screen name="SelectStyle" component={SelectStyleScreen} />
      <Stack.Screen name="SelectPalette" component={SelectPaletteScreen} />
      <Stack.Screen name="GenerateDesign" component={GenerateDesignScreen} />
      <Stack.Screen name="ImageDetail" component={ImageDetailScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator
export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
}
