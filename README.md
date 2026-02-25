# authrn

A React Native authentication app built with TypeScript, Context API, and AsyncStorage. Covers Login, Signup, and Home screens with persistent sessions.

---

## Features

- **Login** — email + password validation, inline error banner, password visibility toggle
- **Signup** — name, email, password with the same UX polish
- **Home** — avatar with initials, user info card, logout
- **Persistent session** — user stays logged in after app restart (AsyncStorage)
- **Persistent mock DB** — registered accounts survive app restarts
- **Splash screen** — shown while session is being restored on startup

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React Native 0.84 + TypeScript |
| Navigation | `@react-navigation/native` + `@react-navigation/native-stack` |
| State management | React Context API (`AuthContext`) |
| Persistence | `@react-native-async-storage/async-storage` v2 |
| Safe areas | `react-native-safe-area-context` |

---

## Architecture

```
src/
├── context/
│   └── AuthContext.tsx      # Global auth state, login/signup/logout logic
├── navigation/
│   └── RootNavigator.tsx    # Conditional Auth / Main stack
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   └── HomeScreen.tsx
├── theme/
│   ├── colors.ts            # Color token definitions
│   ├── globalStyles.ts      # Shared StyleSheet (layout, form, button, etc.)
│   └── index.ts             # Barrel export
├── types/
│   └── index.ts             # Shared TypeScript interfaces & nav param lists
└── utils/
    ├── mockDb.ts             # In-memory user store, persisted to AsyncStorage
    └── validation.ts        # Email, password, and non-empty validators
```

**Pattern**: Feature-based folder structure with a thin-screen / fat-context split.
- Screens only handle local UI state (input focus, password visibility).
- All auth logic lives in `AuthContext` — screens call `login()`, `signup()`, `logout()` and catch thrown errors for display.
- Styles are centralized in `src/theme/` and imported as `globalStyles`; screens keep only screen-specific overrides locally.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Ruby (for CocoaPods on macOS)
- Xcode (iOS) or Android Studio (Android)

### Install

```bash
npm install

# iOS only
cd ios && pod install && cd ..
```

### Run

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## Usage

1. Open the app — you'll see the **Login** screen.
2. Tap **Go to Signup** to create an account (name, email, password ≥ 6 chars).
3. After signing up you're automatically logged in and land on the **Home** screen.
4. Tap **Logout** to return to Login.
5. Your account is persisted — you can log in again after restarting the app.

---

## Project Structure Notes

- `App.tsx` wraps the app with `SafeAreaProvider` → `AuthProvider` → `RootNavigator`
- `RootNavigator` reads `isRestoring` from context to show a splash screen, then switches between `AuthNavigator` and `MainNavigator` based on `user` state
- Mock database uses a simple in-memory array serialized to AsyncStorage under the key `@mock_users`
