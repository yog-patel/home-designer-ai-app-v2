import SubscriptionModal from '@/components/SubscriptionModal';
import { checkUsage } from '@/config/api';
import { getUserId } from '@/config/storage';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const id = await getUserId();
        setUserId(id);

        const usageData = await checkUsage(id);
        setUsage(usageData);

        const notifSetting = await AsyncStorage.getItem('@homeai_notifications');
        setNotifications(notifSetting !== 'false');
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleNotifications = async (value: boolean) => {
    setNotifications(value);
    await AsyncStorage.setItem('@homeai_notifications', value.toString());
  };

  const handleUpgrade = () => {
    setSubscriptionModalVisible(true);
  };

  const handleSubscriptionContinue = (plan: 'weekly' | 'yearly') => {
    setSubscriptionModalVisible(false);
    Alert.alert('Success', `You selected ${plan} plan. Upgrade coming soon!`);
  };

  const handleResetUser = async () => {
    console.log('Reset button pressed');
    
    // Use window.confirm for web, Alert.alert for native
    let confirmed = false;
    
    if (Platform.OS === 'web') {
      confirmed = window.confirm(
        'Reset User Data?\n\nThis will create a new user ID and reset your design history.'
      );
    } else {
      // For native platforms, we'll handle it differently
      Alert.alert(
        'Reset User Data',
        'This will create a new user ID and reset your design history.',
        [
          {
            text: 'Reset',
            onPress: () => {
              performReset();
            },
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return; // Exit early for native, performReset is called from Alert
    }
    
    // For web, proceed with reset if confirmed
    if (confirmed) {
      performReset();
    }
  };

  const performReset = async () => {
    try {
      console.log('Resetting user data...');
      
      // Clear the user ID
      await AsyncStorage.removeItem('@homeai_user_id');
      console.log('User ID removed successfully');
      
      // Show success message
      if (Platform.OS === 'web') {
        window.alert('User data reset successfully! Refresh the page to see changes.');
      } else {
        Alert.alert('Success', 'User data reset. Please restart the app.');
      }
    } catch (error) {
      console.error('Error resetting user data:', error);
      const errorMsg = `Failed to reset: ${error}`;
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <LinearGradient colors={Gradients.hero} style={styles.profileGradient}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={Gradients.primary} style={styles.avatar}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.profileId}>ID: {userId?.slice(0, 8)}...</Text>
            {usage && !usage.is_premium && (
              <View style={styles.freeTriesBadge}>
                <Text style={styles.freeTriesText}>
                  {Math.max(0, 3 - usage.designs_generated)} free tries remaining
                </Text>
              </View>
            )}
            {usage?.is_premium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.premiumBadgeText}>Premium Member</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="finger-print-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.cardLabel}>User ID</Text>
              <Text style={styles.cardValue} numberOfLines={1}>
                {userId?.slice(0, 8)}...
              </Text>
            </View>
          </View>
        </View>

        {/* Usage Section */}
        {usage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Usage</Text>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardRowIcon}>
                  <Ionicons name="images-outline" size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.cardLabel}>Designs Generated</Text>
                <Text style={styles.cardValue}>{usage.designs_generated}</Text>
              </View>

              {!usage.is_premium && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <View style={styles.cardRowIcon}>
                      <Ionicons name="gift-outline" size={20} color={Colors.light.success} />
                    </View>
                    <Text style={styles.cardLabel}>Free Tries Remaining</Text>
                    <Text style={[styles.cardValue, { color: Colors.light.success }]}>
                      {Math.max(0, 3 - usage.designs_generated)}/3
                    </Text>
                  </View>
                </>
              )}

              {usage.is_premium && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <View style={styles.cardRowIcon}>
                      <Ionicons name="infinite-outline" size={20} color={Colors.light.primary} />
                    </View>
                    <Text style={[styles.cardLabel, { color: Colors.light.primary }]}>
                      Premium Active
                    </Text>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.light.success} />
                  </View>
                </>
              )}
            </View>

            {!usage.is_premium && (
              <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade} activeOpacity={0.8}>
                <LinearGradient colors={Gradients.primary} style={styles.upgradeGradient}>
                  <View style={styles.upgradeContent}>
                    <Ionicons name="rocket-outline" size={24} color="#FFFFFF" />
                    <View style={styles.upgradeText}>
                      <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                      <Text style={styles.upgradeSubtitle}>
                        Unlimited designs and exclusive features
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="notifications-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.cardLabel}>Push Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotifications}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.cardLabel}>App Version</Text>
              <Text style={styles.cardValue}>1.0.0</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="document-text-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <View style={styles.cardRowIcon}>
                <Ionicons name="mail-outline" size={20} color={Colors.light.primary} />
              </View>
              <Text style={styles.linkText}>Contact Support</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section} pointerEvents="auto">
          <TouchableOpacity 
            style={styles.dangerCard} 
            onPress={() => {
              console.log('TouchableOpacity pressed');
              handleResetUser();
            }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Reset User Data"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.dangerText}>Reset User Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by home ai</Text>
        </View>
      </ScrollView>

      <SubscriptionModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        onContinue={handleSubscriptionContinue}
      />
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
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    marginBottom: Spacing.xl,
  },
  profileGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileId: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Spacing.sm,
  },
  freeTriesBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  freeTriesText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: '#FFFFFF',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  premiumBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#FFD700',
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  cardRowIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.base,
    backgroundColor: `${Colors.light.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  cardLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  cardValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.borderLight,
    marginLeft: 60,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  upgradeCard: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.colored,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  upgradeSubtitle: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  dangerText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: '#EF4444',
  },
  footer: {
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textTertiary,
  },
});
