import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Note, Category } from '../types';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';
const NOTES_KEY = '@notes';
const CATEGORIES_KEY = '@categories';

class StorageService {
  // User Management
  async registerUser(email: string, password: string, username: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        password,
        username,
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      // Initialize default categories for new user
      await this.initializeDefaultCategories(newUser.id);
      
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }

  async updateUser(userId: string, email: string, username: string, password?: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      users[userIndex].email = email;
      users[userIndex].username = username;
      if (password) {
        users[userIndex].password = password;
      }

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
      }
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Notes Management
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      return allNotes.filter(note => note.userId === userId);
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async addNote(note: Omit<Note, 'id'>): Promise<Note> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
      };
      
      notes.push(newNote);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<boolean> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const noteIndex = notes.findIndex(n => n.id === noteId);
      if (noteIndex === -1) return false;

      notes[noteIndex] = {
        ...notes[noteIndex],
        ...updates,
        dateEdited: new Date().toISOString(),
      };

      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  }

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      const filteredNotes = notes.filter(n => n.id !== noteId);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  // Categories Management
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      const allCategories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      return allCategories.filter(cat => cat.userId === userId);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async initializeDefaultCategories(userId: string): Promise<void> {
    try {
      const categories = await this.getCategories(userId);
      const defaultCategories = ['Work', 'Study', 'Personal'];
      
      const existingNames = categories.map(c => c.name.toLowerCase());
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      const allCategories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];

      defaultCategories.forEach(name => {
        if (!existingNames.includes(name.toLowerCase())) {
          allCategories.push({
            id: `${userId}_${name}_${Date.now()}`,
            name,
            userId,
          });
        }
      });

      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(allCategories));
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  }

  async addCategory(userId: string, name: string): Promise<Category> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      const newCategory: Category = {
        id: `${userId}_${name}_${Date.now()}`,
        name,
        userId,
      };
      
      categories.push(newCategory);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      const filteredCategories = categories.filter(c => c.id !== categoryId);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();

