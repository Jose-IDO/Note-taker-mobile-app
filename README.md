# Note Taker App

A secure, feature-rich React Native mobile application built with Expo and TypeScript. This app fulfills all requirements for the React Native Lesson 3 assessment, focusing on navigation, routing, and comprehensive note management with category organization.

## 📱 Download the App

**Direct Download Link:** [Download APK from Google Drive](https://drive.google.com/drive/folders/1Ec2kRdOHjdpofd8DZRxdZbm-dg6KYDXc?usp=sharing)

The production Android APK (65.2 MB) is available for direct download and installation on Android devices.

---

## ✅ Assessment Requirements Coverage

This application fully implements all requirements specified in the React Native Lesson 3 assessment:

### 1. User Management ✅

#### Authentication
- ✅ **Registration**: Users can register with:
  - Email address
  - Password
  - Username
- ✅ **Login**: Users can sign in with their registered email and password credentials
- ✅ **Authorization**: Protected routing ensures:
  - Logged-in users cannot access Login/Register screens
  - Unauthenticated users cannot access Notes, Categories, or Settings screens
  - Navigation automatically redirects based on authentication state

#### Profile Management
- ✅ **Update Credentials**: Users can update their:
  - Email address
  - Username
  - Password (with current password verification)

### 2. Notes Management ✅

#### Add Function
- ✅ Users can create new notes with:
  - **Notes** (text content - required)
  - **Date added** (automatically timestamped)
  - **Category** (selected from available categories)
  - **Title** (optional field)

#### Read Function
- ✅ Users can view all their existing notes in a scrollable list
- ✅ Notes display title, category, preview content, and timestamps
- ✅ Tap any note to view full details

#### Update Function
- ✅ Users can edit existing notes
- ✅ Updated notes automatically receive a **timestamp** showing when they were edited
- ✅ Both creation date and edit date are displayed

#### Delete Function
- ✅ Users can delete notes with confirmation dialog
- ✅ Deleted notes are permanently removed from storage

#### Search Function
- ✅ Users can search notes by typing words
- ✅ Search matches **every single word** in saved notes (searches both title and content)
- ✅ Real-time filtering as you type
- ✅ Works across all note fields

#### Sorting Function
- ✅ Users can sort notes by date added:
  - **Ascending** (oldest first)
  - **Descending** (newest first)
- ✅ Toggle button to switch between sort orders
- ✅ Visual indicator shows current sort direction

### 3. Categories ✅

- ✅ **Fixed Default Categories**: Work, Study, Personal (initialized for new users)
- ✅ **Category Selector**: Users can select categories when creating/editing notes
- ✅ **Add Categories**: Users can create custom categories
- ✅ **Delete Categories**: Users can remove categories (with warning for defaults)
- ✅ **Category Filtering**: Notes list can be filtered by category using category chips
- ✅ **Category Pages**: Different categories are viewable on separate filtered views

### 4. Data Persistence ✅

- ✅ **AsyncStorage**: All data (users, notes, categories, session) stored locally using AsyncStorage
- ✅ **Persistent Sessions**: User login state persists across app restarts
- ✅ **Data Isolation**: Each user's notes and categories are isolated by user ID

---

## 🎨 Features & Design

- **Modern UI**: Clean, gradient-based design with blue, violet, and purple color schemes
- **Smooth Navigation**: React Navigation with stack and bottom tab navigators
- **Responsive Layout**: Optimized for mobile devices with safe area handling
- **Type Safety**: Full TypeScript implementation for reliability
- **Error Handling**: User-friendly error messages and validation

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.15.0 or higher recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your mobile device (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jose-IDO/Note-taker-mobile-app.git
cd Note-taker-mobile-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

Once the Expo dev server starts:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with:
  - **Android**: Expo Go app
  - **iOS**: Camera app (opens in Expo Go)

### Building for Production

The app is configured with EAS Build. To create a production build:

```bash
# Android APK
npx eas build --platform android --profile production

# iOS (requires Apple Developer account)
npx eas build --platform ios --profile production
```

---

## 📁 Project Structure

```
note-taker-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── GradientButton.tsx
│   │   └── GradientCard.tsx
│   ├── constants/           # App constants
│   │   └── colors.ts
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/          # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/             # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── notes/
│   │   │   ├── NotesScreen.tsx
│   │   │   ├── AddNoteScreen.tsx
│   │   │   ├── EditNoteScreen.tsx
│   │   │   └── ViewNoteScreen.tsx
│   │   ├── categories/
│   │   │   └── CategoriesScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   ├── services/            # Business logic
│   │   └── storageService.ts
│   ├── styles/              # Global styles
│   │   └── globalStyles.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
├── assets/                  # Images and static assets
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🛠 Tech Stack

- **Framework**: React Native 0.73.6
- **Platform**: Expo SDK 50
- **Language**: TypeScript 5.1.3
- **Navigation**: React Navigation 6.x
  - Stack Navigator (for auth and notes flow)
  - Bottom Tab Navigator (for main app sections)
- **Storage**: @react-native-async-storage/async-storage
- **UI Libraries**:
  - Expo Linear Gradient (for gradient effects)
  - @expo/vector-icons (for icons)
- **State Management**: React Context API

---

## 📋 Key Implementation Details

### Protected Routing
- Authentication state managed via React Context
- Navigation automatically switches between Auth and Main navigators
- Unauthorized access attempts redirect to login

### Search Algorithm
- Splits search query into individual words
- Matches each word against note title and content
- Case-insensitive matching
- Real-time filtering

### Data Model
- **User**: id, email, username, password
- **Note**: id, userId, title (optional), content, category, dateAdded, dateEdited
- **Category**: id, name, userId

### Category Management
- Default categories auto-created for new users
- User-created categories stored per user
- Category deletion with safety warnings
- Notes automatically filtered when category deleted

---

## 🧪 Testing the App

1. **Register a new account** with email, password, and username
2. **Create notes** in different categories
3. **Test search** by typing words from your notes
4. **Sort notes** by date (ascending/descending)
5. **Edit notes** and verify edit timestamp appears
6. **Delete notes** and confirm removal
7. **Add/delete categories** and verify notes update
8. **Update profile** settings and change password
9. **Logout and login** to verify session persistence

---

## 📝 Notes

- All data is stored locally using AsyncStorage (no backend required)
- Each user's data is isolated by user ID
- The app works completely offline
- Production build available for Android (APK format)

---

## 👤 Author

Joseph-Homiee

---

## 📄 License

This project is private and created for educational assessment purposes.

---

## 🔗 Links

- **Download APK**: [Google Drive Link](https://drive.google.com/drive/folders/1Ec2kRdOHjdpofd8DZRxdZbm-dg6KYDXc?usp=sharing)
- **Repository**: [GitHub](https://github.com/Jose-IDO/Note-taker-mobile-app)
