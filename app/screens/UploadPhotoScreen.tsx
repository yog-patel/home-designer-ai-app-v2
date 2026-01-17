import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

type UploadPhotoScreenProps = NativeStackNavigationProp<RootStackParamList, 'Upload'>;

interface Props {
  navigation: UploadPhotoScreenProps;
  route: any;
}

export const UploadPhotoScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Image picked:', uri);
        setSelectedImage(uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      alert('Failed to pick image');
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Camera image captured:', uri);
        setSelectedImage(uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Failed to take picture');
    }
  };

  const handleContinue = () => {
    if (selectedImage) {
      navigation.navigate('RoomType', { imageUri: selectedImage, action: route.params.action });
    }
  };

  const isPaintAction = route.params.action === 'paint';
  const stepText = isPaintAction ? 'Step 1 / 3' : 'Step 1 / 4';
  const progressWidth = isPaintAction ? '33%' : '25%';

  const tips = [
    { icon: 'sunny-outline', text: 'Good lighting helps', color: '#F59E0B' },
    { icon: 'camera-outline', text: 'Clear angles work best', color: '#10B981' },
    { icon: 'phone-landscape-outline', text: 'Landscape orientation', color: '#6366F1' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{stepText}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} scrollEnabled={true} nestedScrollEnabled={true}>
        <Text style={styles.title}>Add a Photo</Text>
        <Text style={styles.subtitle}>Upload or capture an image of your space</Text>

        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.previewImage}
              onLoad={() => console.log('Image loaded successfully')}
              onError={(error) => console.error('Image load error:', error)}
            />
            <View style={styles.imageActions}>
              <TouchableOpacity 
                onPress={() => setPreviewModalVisible(true)}
                style={styles.imageActionButton}
              >
                <Ionicons name="expand-outline" size={20} color={Colors.light.text} />
                <Text style={styles.imageActionText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageActionButton} onPress={pickImage}>
                <Ionicons name="pencil-outline" size={20} color={Colors.light.text} />
                <Text style={styles.imageActionText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <View style={styles.uploadIconContainer}>
              <LinearGradient
                colors={Gradients.primary}
                style={styles.uploadIconGradient}
              >
                <Ionicons name="cloud-upload-outline" size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.uploadText}>Start Redesigning</Text>
            <Text style={styles.uploadSubtext}>Redesign and beautify your room</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePicture}>
                <View style={styles.uploadButtonIcon}>
                  <Ionicons name="camera" size={28} color={Colors.light.primary} />
                </View>
                <Text style={styles.uploadButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <View style={styles.uploadButtonIcon}>
                  <Ionicons name="images" size={28} color={Colors.light.primary} />
                </View>
                <Text style={styles.uploadButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>
            <Ionicons name="bulb-outline" size={18} color={Colors.light.warning} /> Upload Tips
          </Text>
          <View style={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={[styles.tipIconContainer, { backgroundColor: `${tip.color}15` }]}>
                  <Ionicons name={tip.icon as any} size={20} color={tip.color} />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedImage && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedImage}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedImage ? Gradients.dark : ['#CCCCCC', '#CCCCCC']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Image Preview Modal */}
      <Modal visible={previewModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setPreviewModalVisible(false)}
          >
            <View style={styles.closeButtonCircle}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  stepText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.light.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
  },
  imagePreviewContainer: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.light.backgroundSecondary,
    ...Shadows.lg,
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  imageActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  imageActionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  uploadPlaceholder: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  uploadIconContainer: {
    marginBottom: Spacing.base,
  },
  uploadIconGradient: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  uploadSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },
  uploadButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.light.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  tipsSection: {
    marginBottom: Spacing['2xl'],
  },
  tipsTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  tipsGrid: {
    gap: Spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
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
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.base,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

