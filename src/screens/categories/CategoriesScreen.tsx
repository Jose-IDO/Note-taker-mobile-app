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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Category } from '../../types';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';

export default function CategoriesScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    const cats = await storageService.getCategories(user.id);
    setCategories(cats);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  }, [user]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!user) return;

    // Check if category already exists
    const exists = categories.some(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (exists) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    setLoading(true);
    try {
      await storageService.addCategory(user.id, newCategoryName.trim());
      setNewCategoryName('');
      await loadCategories();
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    // Check if category is a default one
    const defaultCategories = ['Work', 'Study', 'Personal'];
    const isDefault = defaultCategories.includes(category.name);

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?${
        isDefault ? '\n\nNote: This is a default category and can be re-added later.' : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteCategory(category.id);
            await loadCategories();
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryInfo}>
        <View style={styles.categoryIcon}>
          <Ionicons name="folder" size={24} color={colors.primary} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteCategory(item)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add New Category</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { marginRight: 8 }]}
            placeholder="Category name"
            placeholderTextColor={colors.textLight}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <GradientButton
            title="Add"
            onPress={handleAddCategory}
            disabled={loading}
            style={styles.addButton}
          />
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={styles.listTitle}>Your Categories</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  addSection: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: colors.text,
  },
  addButton: {
    marginVertical: 0,
    minWidth: 80,
  },
  listContent: {
    padding: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    padding: 8,
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
});

