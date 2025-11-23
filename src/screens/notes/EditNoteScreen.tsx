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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Note, Category } from '../../types';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';

type NotesStackParamList = {
  NotesList: undefined;
  EditNote: { note: Note };
};

type EditNoteScreenNavigationProp = StackNavigationProp<NotesStackParamList, 'EditNote'>;
type EditNoteScreenRouteProp = RouteProp<NotesStackParamList, 'EditNote'>;

export default function EditNoteScreen() {
  const navigation = useNavigation<EditNoteScreenNavigationProp>();
  const route = useRoute<EditNoteScreenRouteProp>();
  const { user } = useAuth();
  const { note } = route.params;

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    if (!user) return;
    const cats = await storageService.getCategories(user.id);
    setCategories(cats);
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

    setLoading(true);
    try {
      await storageService.updateNote(note.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        category,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update note');
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
          title="Update Note"
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

