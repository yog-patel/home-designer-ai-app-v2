import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserId } from '@/config/storage';
import { checkUsage } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionModal from '@/components/SubscriptionModal';

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

  const handleResetUser = () => {
    Alert.alert(
      'Reset User Data',
      'This will create a new user ID and reset your design history.',
      [
        {
          text: 'Reset',
          onPress: async () => {
            await AsyncStorage.removeItem('@homeai_user_id');
            Alert.alert('Success', 'User data reset. Please restart the app.');
          },
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.card}>
            <View style={styles.cardRow}>
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
                <Text style={styles.cardLabel}>Designs Generated</Text>
                <Text style={styles.cardValue}>{usage.designs_generated}</Text>
              </View>

              {!usage.is_premium && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Free Tries Remaining</Text>
                    <Text style={styles.cardValue}>
                      {Math.max(0, 3 - usage.designs_generated)}/3
                    </Text>
                  </View>
                </>
              )}

              {usage.is_premium && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <Text style={[styles.cardLabel, { color: '#E31C1C' }]}>
                      Premium Member
                    </Text>
                    <Text style={[styles.cardValue, { color: '#E31C1C' }]}>Active</Text>
                  </View>
                </>
              )}
            </View>

            {!usage.is_premium && (
              <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeSubtitle}>
                  Unlimited designs and exclusive features
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.cardLabel}>Push Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotifications}
                trackColor={{ false: '#E8E8E8', true: '#E31C1C' }}
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
              <Text style={styles.cardLabel}>App Version</Text>
              <Text style={styles.cardValue}>1.0.0</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Contact Support</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerCard} onPress={handleResetUser}>
            <Text style={styles.dangerText}>Reset User Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with care by home ai</Text>
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  arrow: {
    fontSize: 16,
    color: '#999',
  },
  upgradeCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E31C1C',
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E31C1C',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 13,
    color: '#E31C1C',
    opacity: 0.7,
  },
  dangerCard: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
