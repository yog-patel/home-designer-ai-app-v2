import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DESIGN_STYLES } from '@/config/constants';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { getIconComponent } from '@/components/icons';

type SelectStyleScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectStyle'>;
type SelectStyleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectStyle'>;

export default function SelectStyleScreen() {
  const navigation = useNavigation<SelectStyleScreenNavigationProp>();
  const route = useRoute<SelectStyleScreenProps['route']>();
  const { imageUri, roomType, action } = route.params;
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleContinue = () => {
    if (selectedStyle) {
      navigation.navigate('SelectPalette', {
        imageUri,
        roomType,
        style: selectedStyle,
        palette: '',
        customPrompt: selectedStyle === 'custom' ? customPrompt : undefined,
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

  const StyleItem = ({ item }: any) => {
    const IconComponent = getIconComponent(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.styleItem,
          selectedStyle === item.id && styles.styleItemSelected,
        ]}
        onPress={() => {
          setSelectedStyle(item.id);
          if (item.id !== 'custom') {
            setCustomPrompt('');
          }
        }}
      >
        <IconComponent size={28} color={selectedStyle === item.id ? '#E31C1C' : '#000'} />
        <Text style={styles.styleName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step 3 of 4</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '75%' }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Select Style</Text>
        <Text style={styles.subtitle}>
          Choose your desired design style to start creating your ideal interior
        </Text>

        <FlatList
          data={DESIGN_STYLES}
          renderItem={StyleItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.grid}
          scrollEnabled={false}
        />

        {selectedStyle === 'custom' && (
          <View style={styles.customSection}>
            <Text style={styles.customLabel}>Describe Your Style</Text>
            <TextInput
              style={styles.customInput}
              placeholder="e.g., Cozy Scandinavian with warm lighting and natural materials"
              placeholderTextColor="#999"
              value={customPrompt}
              onChangeText={setCustomPrompt}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.customHint}>
              Be specific about colors, materials, and atmosphere for best results
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedStyle || (selectedStyle === 'custom' && !customPrompt)) &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedStyle || (selectedStyle === 'custom' && !customPrompt)}
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
  styleItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  styleItemSelected: {
    borderColor: '#E31C1C',
    backgroundColor: '#FFF5F5',
  },
  styleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  styleName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  customSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  customInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  customHint: {
    fontSize: 12,
    color: '#999',
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
