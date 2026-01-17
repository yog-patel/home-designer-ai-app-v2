import { getUserId } from '@/config/storage';
import { supabase } from '@/config/supabase';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeTabs'>;

export default function GalleryScreen({ navigation }: any) {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadDesigns = async () => {
        try {
          const id = await getUserId();
          setUserId(id);

          const { data, error } = await supabase
            .from('designs')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setDesigns(data || []);
        } catch (error) {
          console.error('Error loading designs:', error);
        } finally {
          setLoading(false);
        }
      };

      loadDesigns();
    }, [])
  );

  const handleImagePress = (item: any) => {
    navigation.navigate('ImageDetail' as any, {
      imageUrl: item.generated_image,
      roomType: item.room_type,
      style: item.style,
      palette: item.palette,
      createdAt: item.created_at,
    });
  };

  const DesignCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.designCard}
      onPress={() => handleImagePress(item)}
      activeOpacity={0.9}
    >
      {item.generated_image && (
        <Image
          source={{ uri: item.generated_image }}
          style={styles.designImage}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.designOverlay}
      />
      <View style={styles.designInfo}>
        <View style={styles.designMeta}>
          <View style={styles.designBadge}>
            <Text style={styles.designRoom}>{item.room_type}</Text>
          </View>
          <Text style={styles.designStyle}>{item.style}</Text>
        </View>
        <Text style={styles.designDate}>
          {new Date(item.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading designs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Designs</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{designs.length}</Text>
        </View>
      </View>

      {designs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.emptyIconGradient}
            >
              <Ionicons name="images-outline" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.emptyTitle}>No Designs Yet</Text>
          <Text style={styles.emptyMessage}>
            Your AI-generated designs will appear here.{'\n'}Start creating to see the magic!
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Gradients.primary}
              style={styles.emptyButtonGradient}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Create Design</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={designs}
          renderItem={DesignCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  countBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  countText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  emptyIconContainer: {
    marginBottom: Spacing.xl,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  grid: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  listContent: {
    padding: Spacing.sm,
  },
  designCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    margin: Spacing.sm,
    overflow: 'hidden',
    backgroundColor: Colors.light.background,
    ...Shadows.lg,
  },
  designImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  designOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  designInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.md,
  },
  designMeta: {
    marginBottom: Spacing.xs,
  },
  designBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  designRoom: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  designStyle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  designDate: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
  },
});
