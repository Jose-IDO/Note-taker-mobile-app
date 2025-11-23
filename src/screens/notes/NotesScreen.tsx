import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Note, Category } from '../../types';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';

type NotesStackParamList = {
  NotesList: undefined;
  AddNote: undefined;
  EditNote: { note: Note };
  ViewNote: { note: Note };
};

type NotesScreenNavigationProp = StackNavigationProp<NotesStackParamList, 'NotesList'>;

type SortOrder = 'asc' | 'desc';

export default function NotesScreen() {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, selectedCategory, searchQuery, sortOrder]);

  const loadData = async () => {
    if (!user) return;
    
    const [notesData, categoriesData] = await Promise.all([
      storageService.getNotes(user.id),
      storageService.getCategories(user.id),
    ]);
    
    setNotes(notesData);
    setCategories(categoriesData);
  };

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/);
      
      filtered = filtered.filter(note => {
        const noteText = `${note.title || ''} ${note.content}`.toLowerCase();
        return queryWords.some(word => noteText.includes(word));
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredNotes(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [user]);

  const handleDelete = (note: Note) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteNote(note.id);
            await loadData();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate('ViewNote', { note: item })}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteHeaderLeft}>
          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title || 'Untitled Note'}
          </Text>
          <Text style={styles.noteCategory}>{item.category}</Text>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditNote', { note: item })}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          Added: {formatDate(item.dateAdded)}
        </Text>
        {item.dateEdited && (
          <Text style={styles.noteDate}>
            Edited: {formatDate(item.dateEdited)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TextInput
          style={[styles.searchInput, { marginRight: 8 }]}
          placeholder="Search notes..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Ionicons
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.sortText, { marginLeft: 4 }]}>
            {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={['All', ...categories.map(c => c.name)]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No notes found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search' : 'Create your first note!'}
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <GradientButton
          title="+ Add Note"
          onPress={() => navigation.navigate('AddNote')}
          style={styles.fab}
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
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  categoryContainer: {
    marginVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  noteCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteHeaderLeft: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  noteCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  noteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noteDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  fab: {
    marginVertical: 0,
  },
});

