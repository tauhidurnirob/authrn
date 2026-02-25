import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoginScreen } from '../screens/login/LoginScreen';
import { SignupScreen } from '../screens/signup/SignupScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AuthStackParamList, MainStackParamList } from '../types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Home" component={HomeScreen} />
  </MainStack.Navigator>
);

export const RootNavigator = () => {
  const { user, isRestoring } = useAuth();
  const { styles: g, colors, colorScheme } = useTheme();

  if (isRestoring) {
    return (
      <View style={g.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      <NavigationContainer>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
};
