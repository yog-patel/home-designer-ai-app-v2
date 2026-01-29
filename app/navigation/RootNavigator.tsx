import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

// Screens
import GalleryScreen from '../screens/GalleryScreen';
import GenerateDesignScreen from '../screens/GenerateDesignScreen';
import { HomeScreen } from '../screens/HomeScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';
import RoomTypeScreen from '../screens/RoomTypeScreen';
import SelectPaletteScreen from '../screens/SelectPaletteScreen';
import SelectStyleScreen from '../screens/SelectStyleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { UploadPhotoScreen } from '../screens/UploadPhotoScreen';

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

// Custom Tab Bar Icon Component
function TabBarIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  if (focused) {
    return (
      <View style={styles.activeIconContainer}>
        <LinearGradient
          colors={Gradients.primary}
          style={styles.activeIconBackground}
        >
          <Ionicons name={name} size={22} color="#FFFFFF" />
        </LinearGradient>
      </View>
    );
  }
  return <Ionicons name={name} size={24} color={Colors.light.textTertiary} />;
}

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textTertiary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 95 : 80,
          paddingTop: Spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.base,
          backgroundColor: Colors.light.background,
          borderTopWidth: 0,
          ...Shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontWeight: Typography.weights.semibold,
          marginTop: Spacing.xs,
          marginBottom: Spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Designs',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'images' : 'images-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} focused={focused} />
          ),
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
        animation: 'slide_from_right',
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

const styles = StyleSheet.create({
  activeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBackground: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.colored,
  },
});
