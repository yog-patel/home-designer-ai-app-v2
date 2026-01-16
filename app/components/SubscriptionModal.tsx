import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (plan: 'weekly' | 'yearly') => void;
}

export default function SubscriptionModal({
  visible,
  onClose,
  onContinue,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'yearly'>('yearly');
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const designImages = [
    'https://createvision.ai/_next/image?url=https%3A%2F%2Fpub-1376ac4a4a844fd5a7a29c8666f4560e.r2.dev%2Fstatic%2Fguides%2Fai-room-designer-complete-guide%2Fai-room-designer-comparison.png&w=1920&q=75',
    'https://blog.pincel.app/wp-content/uploads/2023/10/change-house-exterior-on-photo-online-1.jpg',
    'https://blog.pincel.app/wp-content/uploads/2023/10/house-exterior-landscaping-photo-generator.jpg',
  ];

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % designImages.length;
      setCurrentImageIndex(nextIndex);
      
      if (scrollViewRef.current) {
        const screenWidth = Dimensions.get('window').width - 32; // Account for padding
        scrollViewRef.current.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [visible, currentImageIndex, designImages.length]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Restore</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Design Images Carousel - Horizontal Scroll */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            pagingEnabled
            style={styles.imagesScrollContainer}
          >
            {designImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.designImage}
              />
            ))}
          </ScrollView>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#E31C1C" />
              <Text style={styles.featureText}>Faster Rendering</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#E31C1C" />
              <Text style={styles.featureText}>Ad-free Experience</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#E31C1C" />
              <Text style={styles.featureText}>Unlimited Design Renders</Text>
            </View>
          </View>

          {/* Free Trial Toggle */}
          <View style={styles.trialToggleContainer}>
            <Text style={styles.trialText}>Enable free trial</Text>
            <Switch
              value={freeTrialEnabled}
              onValueChange={setFreeTrialEnabled}
              trackColor={{ false: '#E8E8E8', true: '#E31C1C' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Pricing Plans */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>YEARLY ACCESS</Text>
                <Text style={styles.planPrice}>Just $54.99 per year</Text>
              </View>
              <View style={styles.bestOfferBadge}>
                <Text style={styles.bestOfferText}>BEST OFFER</Text>
              </View>
            </View>
            <Text style={styles.planPerWeek}>$1.06 per week</Text>
            {selectedPlan === 'yearly' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              styles.planCardWeekly,
              selectedPlan === 'weekly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('weekly')}
          >
            <View>
              <Text style={styles.planName}>WEEKLY ACCESS</Text>
              <Text style={styles.planPrice}>$13.99 per week</Text>
            </View>
            {selectedPlan === 'weekly' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>

          {/* Cancel Anytime */}
          <View style={styles.cancelAnytimeContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.cancelAnytimeText}>Cancel Anytime</Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => onContinue(selectedPlan)}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footerContainer}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.footerLink}>Cancel Anytime</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imagesScrollContainer: {
    marginBottom: 32,
    height: 280,
    width: '100%',
  },
  designImage: {
    width: Dimensions.get('window').width - 32,
    height: 280,
    borderRadius: 16,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  trialToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  trialText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#222222',
  },
  planCardSelected: {
    borderColor: '#E31C1C',
    backgroundColor: '#1A0A0A',
  },
  planCardWeekly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planPerWeek: {
    fontSize: 13,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  bestOfferBadge: {
    backgroundColor: '#E31C1C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bestOfferText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E31C1C',
  },
  cancelAnytimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cancelAnytimeText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#E31C1C',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 12,
    color: '#666666',
  },
  footerDot: {
    fontSize: 12,
    color: '#666666',
  },
  spacer: {
    height: 16,
  },
});
