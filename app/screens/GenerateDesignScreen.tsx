import { checkUsage, generateDesign, uploadImage } from '@/config/api';
import { generatePrompt } from '@/config/constants';
import { getUserId } from '@/config/storage';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type GenerateDesignScreenProps = NativeStackScreenProps<RootStackParamList, 'GenerateDesign'>;
type GenerateDesignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenerateDesign'>;

const LOADING_STEPS = [
  { id: 1, text: 'Analyzing your image...', icon: 'scan-outline' },
  { id: 2, text: 'Applying design style...', icon: 'brush-outline' },
  { id: 3, text: 'Generating your design...', icon: 'sparkles-outline' },
  { id: 4, text: 'Adding finishing touches...', icon: 'color-wand-outline' },
];

export default function GenerateDesignScreen() {
  const navigation = useNavigation<GenerateDesignScreenNavigationProp>();
  const route = useRoute<GenerateDesignScreenProps['route']>();
  const { imageUri, roomType, style, palette, customPrompt, action } = route.params;
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('Preparing...');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const initGeneration = async () => {
      try {
        setCurrentStep(0);
        setProgress('Initializing...');
        const id = await getUserId();
        setUserId(id);

        setCurrentStep(1);
        setProgress('Uploading image...');
        // Upload original image
        const filename = `photo-${Date.now()}.jpg`;
        const imageUrl = await uploadImage(id, imageUri, filename);

        setCurrentStep(2);
        setProgress('Generating design...');
        // Generate design
        const prompt = customPrompt || generatePrompt(roomType, style, palette, undefined, action);
        const result = await generateDesign(id, imageUrl, prompt, roomType, style, palette);

        setCurrentStep(3);
        if (result.imageUrl) {
          setGeneratedImage(result.imageUrl);
          
          // Increment usage count in database
          try {
            await checkUsage(id, 'increment');
          } catch (usageError) {
            console.error('Failed to update usage:', usageError);
          }
          
          setProgress('Complete!');
        } else {
          throw new Error('No image generated');
        }
      } catch (err: any) {
        console.error('Generation error:', err);
        setError(err.message || 'Failed to generate design');
      } finally {
        setLoading(false);
      }
    };

    initGeneration();
  }, []);

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      Alert.alert('Success', 'Design saved to your photos!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('HomeTabs' as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.loadingIconGradient}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </LinearGradient>
          </View>
          
          <Text style={styles.loadingTitle}>Creating Your Design</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments...</Text>
          
          <View style={styles.stepsContainer}>
            {LOADING_STEPS.map((step, index) => (
              <View 
                key={step.id} 
                style={[
                  styles.stepItem,
                  index <= currentStep && styles.stepItemActive
                ]}
              >
                <View style={[
                  styles.stepIcon,
                  index <= currentStep && styles.stepIconActive
                ]}>
                  {index < currentStep ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : (
                    <Ionicons 
                      name={step.icon as any} 
                      size={16} 
                      color={index <= currentStep ? '#FFFFFF' : Colors.light.textTertiary} 
                    />
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  index <= currentStep && styles.stepTextActive
                ]}>
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.errorIconGradient}
            >
              <Ionicons name="alert-circle-outline" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={handleTryAgain} activeOpacity={0.8}>
            <LinearGradient colors={Gradients.primary} style={styles.retryButtonGradient}>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.successBadge}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.light.success} />
          <Text style={styles.successText}>Design Complete!</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {generatedImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: generatedImage }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Design Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="home-outline" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Room Type</Text>
              <Text style={styles.detailValue}>{roomType}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="brush-outline" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Style</Text>
              <Text style={styles.detailValue}>{style}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="color-palette-outline" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Palette</Text>
              <Text style={styles.detailValue}>{palette}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} activeOpacity={0.8}>
            <LinearGradient colors={Gradients.primary} style={styles.downloadButtonGradient}>
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.downloadButtonText}>Save Design</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <Ionicons name="arrow-back" size={18} color={Colors.light.text} />
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
    alignItems: 'center',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.light.success}15`,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  successText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.success,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    margin: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  generatedImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  detailsCard: {
    margin: Spacing.base,
    marginTop: 0,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  detailsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.base,
    backgroundColor: `${Colors.light.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingIconContainer: {
    marginBottom: Spacing.xl,
  },
  loadingIconGradient: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  loadingSubtext: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing['2xl'],
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    opacity: 0.5,
  },
  stepItemActive: {
    opacity: 1,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepIconActive: {
    backgroundColor: Colors.light.primary,
  },
  stepText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textTertiary,
  },
  stepTextActive: {
    color: Colors.light.text,
    fontWeight: Typography.weights.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorIconContainer: {
    marginBottom: Spacing.xl,
  },
  errorIconGradient: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    backgroundColor: Colors.light.background,
    gap: Spacing.md,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  downloadButton: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  shareButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    gap: Spacing.sm,
  },
  homeButtonText: {
    color: Colors.light.text,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
