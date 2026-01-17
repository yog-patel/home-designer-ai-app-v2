import { COLOR_PALETTES } from '@/config/constants';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const isSelected = selectedPalette === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.paletteItem,
          isSelected && styles.paletteItemSelected,
        ]}
        onPress={() => setSelectedPalette(item.id)}
        activeOpacity={0.7}
      >
        {isPaint ? (
          <>
            <View style={[styles.paintColor, { backgroundColor: item.color }]} />
            <Text style={[styles.paletteName, isSelected && styles.paletteNameSelected]}>{item.name}</Text>
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
            <Text style={[styles.paletteName, isSelected && styles.paletteNameSelected]}>{item.name}</Text>
          </>
        )}
        {isSelected && (
          <View style={styles.checkmarkBadge}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.light.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.stepBadge}>
          <Text style={styles.headerTitle}>{stepText}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.progressBar}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: progressPercentage }]}
        />
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
                activeOpacity={0.7}
              >
                <View style={[styles.paintColorSwatch, { backgroundColor: color.color }]}>
                  {selectedPalette === color.id && (
                    <View style={styles.paintCheckmark}>
                      <Ionicons name="checkmark" size={20} color={color.color === '#FFFFFF' || color.color === '#FFFDD0' || color.color === '#F5F5DC' || color.color === '#FFFF00' ? '#000000' : '#FFFFFF'} />
                    </View>
                  )}
                </View>
                <Text style={[styles.colorName, selectedPalette === color.id && styles.colorNameSelected]}>{color.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <FlatList
            data={COLOR_PALETTES}
            renderItem={PaletteItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedPalette && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedPalette || loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedPalette ? Gradients.primary : ['#CCCCCC', '#CCCCCC']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>{buttonText}</Text>
            <Ionicons name={isPaintAction ? 'brush' : 'sparkles'} size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  headerTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed,
  },
  paletteItem: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
    ...Shadows.sm,
  },
  paletteItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}08`,
  },
  colorRow: {
    flexDirection: 'row',
    height: 48,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  colorBox: {
    flex: 1,
  },
  paletteName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  paletteNameSelected: {
    color: Colors.light.primary,
  },
  checkmarkBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  continueButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  paintGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
  },
  paintItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.light.border,
    padding: Spacing.sm,
    backgroundColor: Colors.light.background,
    ...Shadows.sm,
  },
  paintItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}08`,
  },
  paintColorSwatch: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paintCheckmark: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    textAlign: 'center',
  },
  colorNameSelected: {
    color: Colors.light.primary,
  },
  paintColor: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
