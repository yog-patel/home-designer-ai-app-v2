import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.stepText}>{stepText}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} scrollEnabled={true} nestedScrollEnabled={true}>
        <Text style={styles.title}>Add a Photo</Text>

        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.previewImage}
              onLoad={() => console.log('Image loaded successfully')}
              onError={(error) => console.error('Image load error:', error)}
            />
            <TouchableOpacity 
              onPress={() => setPreviewModalVisible(true)}
              style={styles.inspectButton}
            >
              <MaterialCommunityIcons name="magnify-plus" size={24} color="#FFFFFF" />
              <Text style={styles.inspectButtonText}>View Fullscreen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
              <Text style={styles.changeButtonText}>Change Photo</Text>
            </TouchableOpacity>
            <Text style={styles.debugText}>URI: {selectedImage.substring(0, 50)}...</Text>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadText}>Start Redesigning</Text>
            <Text style={styles.uploadSubtext}>Redesign and beautify your room</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePicture}>
                <MaterialCommunityIcons name="camera" size={32} color="#000000" />
                <Text style={styles.uploadButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <MaterialCommunityIcons name="image" size={32} color="#000000" />
                <Text style={styles.uploadButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.examplesTitle}>Upload Tips</Text>
        <View style={styles.examplesGrid}>
          <Text style={styles.exampleTip}>• Good lighting helps</Text>
          <Text style={styles.exampleTip}>• Clear angles work best</Text>
          <Text style={styles.exampleTip}>• Landscape orientation</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedImage && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedImage}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview Modal */}
      <Modal visible={previewModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setPreviewModalVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 400,
  },
  previewImage: {
    width: '100%',
    height: 360,
    backgroundColor: '#F0F0F0',
  },
  loadingOverlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 999,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 12,
    gap: 8,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadPlaceholder: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  examplesGrid: {
    gap: 8,
    marginBottom: 30,
  },
  exampleCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  exampleEmoji: {
    fontSize: 40,
  },
  exampleTip: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageTouchable: {
    position: 'relative',
    marginBottom: 16,
  },
  inspectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  inspectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    gap: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  inspectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inspectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  debugText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

