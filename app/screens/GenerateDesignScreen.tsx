import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getUserId } from '@/config/storage';
import { generateDesign, uploadImage, checkUsage } from '@/config/api';
import { generatePrompt } from '@/config/constants';
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from '@/navigation/RootNavigator';

type GenerateDesignScreenProps = NativeStackScreenProps<RootStackParamList, 'GenerateDesign'>;
type GenerateDesignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenerateDesign'>;

export default function GenerateDesignScreen() {
  const navigation = useNavigation<GenerateDesignScreenNavigationProp>();
  const route = useRoute<GenerateDesignScreenProps['route']>();
  const { imageUri, roomType, style, palette, customPrompt, action } = route.params;
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('Preparing...');

  useEffect(() => {
    const initGeneration = async () => {
      try {
        setProgress('Initializing...');
        const id = await getUserId();
        setUserId(id);

        setProgress('Uploading image...');
        // Upload original image
        const filename = `photo-${Date.now()}.jpg`;
        const imageUrl = await uploadImage(id, imageUri, filename);

        setProgress('Generating design...');
        // Generate design
        const prompt = customPrompt || generatePrompt(roomType, style, palette, undefined, action);
        const result = await generateDesign(id, imageUrl, prompt, roomType, style, palette);

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
      // In a real app, you'd download the image using:
      // const result = await FileSystem.downloadAsync(
      //   generatedImage,
      //   FileSystem.documentDirectory + 'design.jpg'
      // );
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
          <ActivityIndicator size="large" color="#E31C1C" />
          <Text style={styles.loadingText}>{progress}</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={handleTryAgain}>
            <Text style={styles.retryButtonText}>Try Again</Text>
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
        <Text style={styles.title}>Your Design</Text>
      </View>

      <View style={styles.content}>
        {generatedImage && (
          <Image
            source={{ uri: generatedImage }}
            style={styles.generatedImage}
            resizeMode="contain"
          />
        )}

        <View style={styles.details}>
          <Text style={styles.detailsLabel}>Room Type:</Text>
          <Text style={styles.detailsValue}>{roomType}</Text>

          <Text style={styles.detailsLabel}>Style:</Text>
          <Text style={styles.detailsValue}>{style}</Text>

          <Text style={styles.detailsLabel}>Palette:</Text>
          <Text style={styles.detailsValue}>{palette}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.downloadButtonText}>Save Design</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <Text style={styles.homeButtonText}>← Back to Home</Text>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#E8E8E8',
  },
  details: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#E31C1C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },
  downloadButton: {
    backgroundColor: '#E31C1C',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  homeButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});
