import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubscriptionModal from '../components/SubscriptionModal';
import { checkUsage } from '../config/api';
import { getUserId } from '../config/storage';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '../constants/theme';
import { RootStackParamList, TabParamList } from '../navigation/RootNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


type HomeScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProps;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [usageCount, setUsageCount] = useState(0);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadUsage = async () => {
        try {
          const userId = await getUserId();
          const usageData = await checkUsage(userId, 'check');
          setUsageCount(usageData.designs_generated || 0);
        } catch (error) {
          console.error('Failed to load usage:', error);
          setUsageCount(0);
        }
      };
      loadUsage();
    }, [])
  );

  const features = [
    {
      id: '1',
      title: 'Interior Design',
      subtitle: 'Upload a pic, choose a style, let AI design the room!',
      image: 'https://createvision.ai/_next/image?url=https%3A%2F%2Fpub-1376ac4a4a844fd5a7a29c8666f4560e.r2.dev%2Fstatic%2Fguides%2Fai-room-designer-complete-guide%2Fai-room-designer-comparison.png&w=1920&q=75',
      action: 'interior',
    },
    {
      id: '2',
      title: 'Exterior Design',
      subtitle: 'Snap your home, pick a vibe, let AI craft the facade!',
      image: 'https://blog.pincel.app/wp-content/uploads/2023/10/change-house-exterior-on-photo-online-1.jpg',
      action: 'exterior',
    },
    {
      id: '3',
      title: 'Garden Design',
      subtitle: 'Choose a style you adore and give your garden a whole new vibe with just a simple touch!',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcJbnYjxpr8h8blgqSFb233GJDwyvp0a5-XA&s',
      action: 'garden',
    },
    {
      id: '4',
      title: 'Paint',
      subtitle: 'Pick any color you love and transform your space with just a touch!',
      image: 'https://blog.pincel.app/wp-content/uploads/2023/10/house-exterior-landscaping-photo-generator.jpg',
      action: 'paint',
    },
  ];

  const handleStartDesign = (action: string) => {
    if (usageCount >= 3) {
      alert('You have used all 3 free tries. Please upgrade to continue.');
      return;
    }
    navigation.navigate('Upload', { action });
  };

  const handleProPress = () => {
    setSubscriptionModalVisible(true);
  };

  const handleSubscriptionContinue = (plan: 'weekly' | 'yearly') => {
    setSubscriptionModalVisible(false);
    Alert.alert('Success', `You selected ${plan} plan. Upgrade coming soon!`);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const getFeatureIcon = (action: string) => {
    switch (action) {
      case 'interior':
        return 'sofa-outline';
      case 'exterior':
        return 'home-outline';
      case 'garden':
        return 'flower-outline';
      case 'paint':
        return 'color-palette-outline';
      default:
        return 'brush-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.proBadge} onPress={handleProPress}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proBadgeGradient}
          >
            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
            <Text style={styles.proText}>PRO</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.appTitle}>home</Text>
          <Text style={styles.appTitleAccent}>ai</Text>
        </View>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={Gradients.hero}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Transform Your Space</Text>
              <Text style={styles.heroSubtitle}>
                AI-powered design at your fingertips
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>{3 - usageCount}</Text>
                  <Text style={styles.heroStatLabel}>Free Tries</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>4</Text>
                  <Text style={styles.heroStatLabel}>Design Tools</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Feature Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Design Tools</Text>
          <Text style={styles.sectionSubtitle}>Choose a tool to get started</Text>
        </View>

        {features.map((feature, index) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => handleStartDesign(feature.action)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: feature.image }}
              style={styles.featureImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featureOverlay}
            />
            <View style={styles.featureContent}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={getFeatureIcon(feature.action) as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
              <View style={styles.tryButtonContainer}>
                <LinearGradient
                  colors={Gradients.primary}
                  style={styles.tryButton}
                >
                  <Text style={styles.tryButtonText}>Try It</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SubscriptionModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        onContinue={handleSubscriptionContinue}
      />
    </SafeAreaView>
  );
};



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
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  proBadge: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  proBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    letterSpacing: Typography.letterSpacing.tight,
  },
  appTitleAccent: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    margin: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroGradient: {
    padding: Spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  heroStat: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  heroStatNumber: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: Spacing.xs,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  featureCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.light.card,
    ...Shadows.lg,
  },
  featureImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  featureOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  featureContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  featureSubtitle: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  tryButtonContainer: {
    marginLeft: Spacing.sm,
  },
  tryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  tryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
});

