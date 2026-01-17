import { getIconComponent } from '@/components/icons';
import { DESIGN_STYLES } from '@/config/constants';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SelectStyleScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectStyle'>;
type SelectStyleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectStyle'>;

export default function SelectStyleScreen() {
  const navigation = useNavigation<SelectStyleScreenNavigationProp>();
  const route = useRoute<SelectStyleScreenProps['route']>();
  const { imageUri, roomType, action } = route.params;
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleContinue = () => {
    if (selectedStyle) {
      navigation.navigate('SelectPalette', {
        imageUri,
        roomType,
        style: selectedStyle,
        palette: '',
        customPrompt: selectedStyle === 'custom' ? customPrompt : undefined,
        action,
      });
    }
  };

  // For paint action, skip to directly go to palette selection
  React.useEffect(() => {
    if (action === 'paint') {
      // Navigate directly to palette screen for paint
      navigation.navigate('SelectPalette', {
        imageUri,
        roomType: 'wall',
        style: 'solid',
        palette: '',
        action: 'paint',
      });
    }
  }, [action, imageUri, navigation]);

  const StyleItem = ({ item }: any) => {
    const IconComponent = getIconComponent(item.id);
    const isSelected = selectedStyle === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.styleItem,
          isSelected && styles.styleItemSelected,
        ]}
        onPress={() => {
          setSelectedStyle(item.id);
          if (item.id !== 'custom') {
            setCustomPrompt('');
          }
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.styleIconContainer, isSelected && styles.styleIconContainerSelected]}>
          <IconComponent size={24} color={isSelected ? '#FFFFFF' : Colors.light.text} />
        </View>
        <Text style={[styles.styleName, isSelected && styles.styleNameSelected]}>{item.name}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.light.primary} />
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
          <Text style={styles.headerTitle}>Step 3 of 4</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.progressBar}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: '75%' }]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Select Style</Text>
        <Text style={styles.subtitle}>
          Choose your desired design style to transform your space
        </Text>

        <FlatList
          data={DESIGN_STYLES}
          renderItem={StyleItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.grid}
          scrollEnabled={false}
        />

        {selectedStyle === 'custom' && (
          <View style={styles.customSection}>
            <View style={styles.customHeader}>
              <Ionicons name="create-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.customLabel}>Describe Your Style</Text>
            </View>
            <TextInput
              style={styles.customInput}
              placeholder="e.g., Cozy Scandinavian with warm lighting and natural materials"
              placeholderTextColor={Colors.light.textTertiary}
              value={customPrompt}
              onChangeText={setCustomPrompt}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.customHint}>
              Be specific about colors, materials, and atmosphere for best results
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedStyle || (selectedStyle === 'custom' && !customPrompt)) &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedStyle || (selectedStyle === 'custom' && !customPrompt)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedStyle && !(selectedStyle === 'custom' && !customPrompt) ? Gradients.dark : ['#CCCCCC', '#CCCCCC']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
  grid: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  styleItem: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
    minHeight: 100,
    ...Shadows.sm,
  },
  styleItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}08`,
  },
  styleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  styleIconContainerSelected: {
    backgroundColor: Colors.light.primary,
  },
  styleName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    textAlign: 'center',
  },
  styleNameSelected: {
    color: Colors.light.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  customSection: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  customLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  customInput: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
    textAlignVertical: 'top',
    marginBottom: Spacing.sm,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  customHint: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textTertiary,
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
});
