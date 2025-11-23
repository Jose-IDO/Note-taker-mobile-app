import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Category } from '../../types';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';

type NotesStackParamList = {
  NotesList: undefined;
  AddNote: undefined;
};

type AddNoteScreenNavigationProp = StackNavigationProp<NotesStackParamList, 'AddNote'>;

export default function AddNoteScreen() {
  const navigation = useNavigation<AddNoteScreenNavigationProp>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    if (!user) return;
    const cats = await storageService.getCategories(user.id);
    setCategories(cats);
    if (cats.length > 0 && !category) {
      setCategory(cats[0].name);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Note content is required');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await storageService.addNote({
        userId: user.id,
        title: title.trim() || undefined,
        content: content.trim(),
        category,
        dateAdded: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.name && styles.categoryChipActive,
                  index > 0 && { marginLeft: 8, marginTop: 8 },
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat.name && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Note Content *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your note here..."
            placeholderTextColor={colors.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          title="Save Note"
          onPress={handleSave}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: colors.text,
  },
  textArea: {
    minHeight: 200,
    paddingTop: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: colors.white,
  },
});

