import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { supabase } from '@/config/supabase';
import { getUserId } from '@/config/storage';

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
      activeOpacity={0.7}
    >
      {item.generated_image && (
        <Image
          source={{ uri: item.generated_image }}
          style={styles.designImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.designInfo}>
        <Text style={styles.designRoom}>{item.room_type}</Text>
        <Text style={styles.designStyle}>{item.style}</Text>
        <Text style={styles.designDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E31C1C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Designs</Text>
      </View>

      {designs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Designs Yet</Text>
          <Text style={styles.emptyMessage}>
            Create your first design to see it here
          </Text>
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
        />
      )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  listContent: {
    padding: 8,
  },
  designCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  designImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E8E8E8',
  },
  designInfo: {
    padding: 12,
  },
  designRoom: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  designStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginVertical: 2,
    textTransform: 'capitalize',
  },
  designDate: {
    fontSize: 11,
    color: '#999',
  },
});
