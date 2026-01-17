import { getIconComponent } from '@/components/icons';
import { EXTERIOR_TYPES, FLOOR_TYPES, GARDEN_TYPES, PAINT_TYPES, REPLACE_TYPES, ROOM_TYPES } from '@/config/constants';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RoomTypeScreenProps = NativeStackScreenProps<RootStackParamList, 'RoomType'>;
type RoomTypeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoomType'>;

export default function RoomTypeScreen() {
  const navigation = useNavigation<RoomTypeScreenNavigationProp>();
  const route = useRoute<RoomTypeScreenProps['route']>();
  const { imageUri, action } = route.params;
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Get the appropriate room types based on action
  const getRoomTypes = () => {
    switch (action) {
      case 'exterior':
        return EXTERIOR_TYPES;
      case 'garden':
        return GARDEN_TYPES;
      case 'paint':
        return PAINT_TYPES;
      case 'replace':
        return REPLACE_TYPES;
      case 'floor':
        return FLOOR_TYPES;
      case 'interior':
      default:
        return ROOM_TYPES;
    }
  };

  const getTitleAndSubtitle = () => {
    switch (action) {
      case 'exterior':
        return {
          title: 'Choose Area',
          subtitle: 'Select an exterior area to redesign',
        };
      case 'garden':
        return {
          title: 'Choose Garden Area',
          subtitle: 'Select a garden area to transform',
        };
      case 'paint':
        return {
          title: 'Choose Room',
          subtitle: 'Select a room to repaint',
        };
      case 'replace':
        return {
          title: 'Choose What to Replace',
          subtitle: 'Select what you want to replace or upgrade',
        };
      case 'floor':
        return {
          title: 'Choose Layout Type',
          subtitle: 'Select the type of floor plan to redesign',
        };
      case 'interior':
      default:
        return {
          title: 'Choose Room',
          subtitle: 'Select a room to design and see it transformed in your chosen style',
        };
    }
  };

  const roomTypes = getRoomTypes();
  const { title, subtitle } = getTitleAndSubtitle();

  const handleContinue = () => {
    if (selectedRoom) {
      navigation.navigate('SelectStyle', {
        imageUri,
        roomType: selectedRoom,
        action,
      });
    }
  };

  // For paint action, skip to directly go to palette selection
  React.useEffect(() => {
    if (action === 'paint') {
      // Navigate directly to palette screen for paint
      navigation.navigate('SelectPalette', {
        imageUri,
        roomType: 'wall',
        style: 'solid',
        palette: '',
        action: 'paint',
      });
    }
  }, [action, imageUri, navigation]);

  const RoomItem = ({ item }: any) => {
    const IconComponent = getIconComponent(item.id);
    const isSelected = selectedRoom === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.roomItem,
          isSelected && styles.roomItemSelected,
        ]}
        onPress={() => setSelectedRoom(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.roomIconContainer, isSelected && styles.roomIconContainerSelected]}>
          <IconComponent size={32} color={isSelected ? '#FFFFFF' : Colors.light.text} />
        </View>
        <Text style={[styles.roomName, isSelected && styles.roomNameSelected]}>{item.name}</Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.stepBadge}>
          <Text style={styles.headerTitle}>Step 2 of 4</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.progressBar}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: '50%' }]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <FlatList
          data={roomTypes}
          renderItem={RoomItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          scrollEnabled={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedRoom && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedRoom}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedRoom ? Gradients.dark : ['#CCCCCC', '#CCCCCC']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  headerTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed,
  },
  grid: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  roomItem: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
    ...Shadows.sm,
  },
  roomItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}08`,
  },
  roomIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roomIconContainerSelected: {
    backgroundColor: Colors.light.primary,
  },
  roomName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    textAlign: 'center',
  },
  roomNameSelected: {
    color: Colors.light.primary,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
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
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
