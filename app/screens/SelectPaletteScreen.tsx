import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLOR_PALETTES } from '@/config/constants';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { getUserId } from '@/config/storage';
import { uploadImage, checkUsage } from '@/config/api';

type SelectPaletteScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectPalette'>;
type SelectPaletteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectPalette'>;

// Paint colors for wall painting
const PAINT_COLORS = [
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'lightgray', name: 'Light Gray', color: '#D3D3D3' },
  { id: 'darkgray', name: 'Dark Gray', color: '#A9A9A9' },
  { id: 'black', name: 'Black', color: '#1A1A1A' },
  { id: 'navy', name: 'Navy Blue', color: '#001F3F' },
  { id: 'skyblue', name: 'Sky Blue', color: '#87CEEB' },
  { id: 'teal', name: 'Teal', color: '#008080' },
  { id: 'darkgreen', name: 'Dark Green', color: '#2F4F2F' },
  { id: 'forestgreen', name: 'Forest Green', color: '#228B22' },
  { id: 'olive', name: 'Olive', color: '#808000' },
  { id: 'tan', name: 'Tan', color: '#D2B48C' },
  { id: 'beige', name: 'Beige', color: '#F5F5DC' },
  { id: 'cream', name: 'Cream', color: '#FFFDD0' },
  { id: 'brown', name: 'Brown', color: '#8B4513' },
  { id: 'maroon', name: 'Maroon', color: '#800000' },
  { id: 'red', name: 'Red', color: '#FF0000' },
  { id: 'coral', name: 'Coral', color: '#FF7F50' },
  { id: 'orange', name: 'Orange', color: '#FFA500' },
  { id: 'gold', name: 'Gold', color: '#FFD700' },
  { id: 'yellow', name: 'Yellow', color: '#FFFF00' },
  { id: 'pink', name: 'Pink', color: '#FFC0CB' },
  { id: 'magenta', name: 'Magenta', color: '#FF00FF' },
  { id: 'purple', name: 'Purple', color: '#800080' },
  { id: 'indigo', name: 'Indigo', color: '#4B0082' },
];

export default function SelectPaletteScreen() {
  const navigation = useNavigation<SelectPaletteScreenNavigationProp>();
  const route = useRoute<SelectPaletteScreenProps['route']>();
  const { imageUri, roomType, style, customPrompt, action } = route.params;
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPaintAction = action === 'paint';
  const colors = isPaintAction ? PAINT_COLORS : COLOR_PALETTES;
  const stepText = isPaintAction ? 'Step 3 of 3' : 'Step 4 of 4';
  const progressPercentage = isPaintAction ? '100%' : '100%';
  const buttonText = isPaintAction ? 'Paint Wall' : 'Generate Design';
  const title = isPaintAction ? 'Choose Paint Color' : 'Select Palette';
  const subtitle = isPaintAction 
    ? 'Select a paint color to transform your wall!'
    : 'Choose a color palette to bring your vision to life! Select from curated shades to transform your space.';

  const handleContinue = async () => {
    if (!selectedPalette) return;

    if (isPaintAction) {
      // For paint action, directly navigate to generate design with paint color
      setLoading(true);
      try {
        navigation.navigate('GenerateDesign', {
          imageUri,
          roomType: 'wall',
          style: selectedPalette,
          palette: selectedPalette,
          customPrompt: `Paint the wall with ${selectedPalette} color`,
          action: 'paint',
        });
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // For other actions, go to next step
      navigation.navigate('GenerateDesign', {
        imageUri,
        roomType,
        style,
        palette: selectedPalette,
        customPrompt,
        action,
      });
    }
  };

  const PaletteItem = ({ item }: any) => {
    const isPaint = isPaintAction;
    return (
      <TouchableOpacity
        style={[
          styles.paletteItem,
          selectedPalette === item.id && styles.paletteItemSelected,
        ]}
        onPress={() => setSelectedPalette(item.id)}
      >
        {isPaint ? (
          <>
            <View style={[styles.paintColor, { backgroundColor: item.color }]} />
            <Text style={styles.paletteName}>{item.name}</Text>
          </>
        ) : (
          <>
            <View style={styles.colorRow}>
              {item.colors.map((color: string, index: number) => (
                <View
                  key={`${item.id}-${index}`}
                  style={[styles.colorBox, { backgroundColor: color }]}
                />
              ))}
            </View>
            <Text style={styles.paletteName}>{item.name}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stepText}</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progressPercentage }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {isPaintAction ? (
          <View style={styles.paintGrid}>
            {colors.map((color: any) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.paintItem,
                  selectedPalette === color.id && styles.paintItemSelected,
                ]}
                onPress={() => setSelectedPalette(color.id)}
              >
                <View style={[styles.paintColor, { backgroundColor: color.color }]} />
                <Text style={styles.colorName}>{color.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <FlatList
            data={COLOR_PALETTES}
            renderItem={PaletteItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedPalette && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedPalette || loading}
        >
          <Text style={styles.continueButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E31C1C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  paletteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  paletteItemSelected: {
    borderColor: '#E31C1C',
    backgroundColor: '#FFF5F5',
  },
  colorRow: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  colorBox: {
    flex: 1,
  },
  paletteName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  continueButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paintGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  paintItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    padding: 8,
  },
  paintItemSelected: {
    borderColor: '#E31C1C',
    backgroundColor: '#FFF5F5',
  },
  paintColor: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  colorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
