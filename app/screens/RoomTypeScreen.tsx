import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROOM_TYPES, EXTERIOR_TYPES, GARDEN_TYPES, PAINT_TYPES, REPLACE_TYPES, FLOOR_TYPES } from '@/config/constants';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { getIconComponent } from '@/components/icons';

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
    return (
      <TouchableOpacity
        style={[
          styles.roomItem,
          selectedRoom === item.id && styles.roomItemSelected,
        ]}
        onPress={() => setSelectedRoom(item.id)}
      >
        <IconComponent size={32} color={selectedRoom === item.id ? '#E31C1C' : '#000'} />
        <Text style={styles.roomName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step 2 of 4</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '50%' }]} />
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
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E31C1C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  grid: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roomItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  roomItemSelected: {
    borderColor: '#E31C1C',
    backgroundColor: '#FFF5F5',
  },
  roomIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  roomName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  continueButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
