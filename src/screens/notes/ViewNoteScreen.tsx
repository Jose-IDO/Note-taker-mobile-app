import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Note } from '../../types';
import { colors } from '../../constants/colors';

type NotesStackParamList = {
  NotesList: undefined;
  ViewNote: { note: Note };
  EditNote: { note: Note };
};

type ViewNoteScreenNavigationProp = StackNavigationProp<NotesStackParamList, 'ViewNote'>;
type ViewNoteScreenRouteProp = RouteProp<NotesStackParamList, 'ViewNote'>;

export default function ViewNoteScreen() {
  const navigation = useNavigation<ViewNoteScreenNavigationProp>();
  const route = useRoute<ViewNoteScreenRouteProp>();
  const { note } = route.params;

  const handleDelete = () => {
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
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditNote', { note })}
            style={[styles.actionButton, { marginRight: 16 }]}
          >
            <Ionicons name="pencil" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{note.category}</Text>
        </View>

        {note.title && (
          <Text style={styles.title}>{note.title}</Text>
        )}

        <Text style={styles.contentText}>{note.content}</Text>

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
            <Text style={[styles.dateText, { marginLeft: 8 }]}>
              Added: {formatDate(note.dateAdded)}
            </Text>
          </View>
          {note.dateEdited && (
            <View style={styles.dateContainer}>
              <Ionicons name="create-outline" size={16} color={colors.textLight} />
              <Text style={[styles.dateText, { marginLeft: 8 }]}>
                Edited: {formatDate(note.dateEdited)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    gap: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: colors.textLight,
  },
});

