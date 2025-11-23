import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

import NotesScreen from '../screens/notes/NotesScreen';
import AddNoteScreen from '../screens/notes/AddNoteScreen';
import EditNoteScreen from '../screens/notes/EditNoteScreen';
import ViewNoteScreen from '../screens/notes/ViewNoteScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NotesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="NotesList" 
        component={NotesScreen}
        options={{ title: 'My Notes' }}
      />
      <Stack.Screen 
        name="AddNote" 
        component={AddNoteScreen}
        options={{ title: 'Add Note' }}
      />
      <Stack.Screen 
        name="EditNote" 
        component={EditNoteScreen}
        options={{ title: 'Edit Note' }}
      />
      <Stack.Screen 
        name="ViewNote" 
        component={ViewNoteScreen}
        options={{ title: 'Note Details' }}
      />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CategoriesList" 
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.tertiary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Notes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Notes" component={NotesStack} />
      <Tab.Screen name="Categories" component={CategoriesStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

