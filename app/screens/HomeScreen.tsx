import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, RootStackNavigationProp, TabParamList } from '../navigation/RootNavigator';
import { getUserId } from '../config/storage';
import { checkUsage } from '../config/api';
import SubscriptionModal from '../components/SubscriptionModal';


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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.proBadge} onPress={handleProPress}>
          <MaterialCommunityIcons name="plus-circle" size={12} color="#FFFFFF" />
          <Text style={styles.proText}>PRO</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>home ai</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" style={{ paddingRight: 12 }} size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Usage Counter */}
        <View style={styles.usageContainer}>
          {/* <Text style={styles.usageText}> */}
            {/* {3 - usageCount} free tries remaining */}
          {/* </Text> */}
        </View>

        {/* Feature Cards */}
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <Image
              source={{ uri: feature.image }}
              style={styles.featureImage}
              resizeMode="cover"
            />
            <View style={styles.featureContent}>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
              <TouchableOpacity
                style={styles.tryButton}
                onPress={() => handleStartDesign(feature.action)}
              >
                <Text style={styles.tryButtonText}>Try It!</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E63946',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    paddingLeft: 70,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  usageContainer: {
    marginTop: 1,
    marginBottom: 20,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  usageText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  featureCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F5F5F5',
  },
  featureImageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 80,
  },
  featureContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 19,
  },
  tryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  tryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

