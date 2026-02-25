import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const HomeScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { styles: g } = useTheme();

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={g.safe}>
      <View style={g.homeContainer}>
        <View style={g.homeTopSection}>
          <View style={g.homeAvatar}>
            <Text style={g.homeAvatarText}>
              {user ? getInitials(user.name) : '?'}
            </Text>
          </View>
          <Text style={g.homeGreeting}>Hello,</Text>
          <Text style={g.homeName}>{user?.name}</Text>
        </View>

        <View style={g.homeCard}>
          <View style={g.homeCardRow}>
            <Text style={g.homeCardLabel}>Name</Text>
            <Text style={g.homeCardValue}>{user?.name}</Text>
          </View>
          <View style={g.homeDivider} />
          <View style={g.homeCardRow}>
            <Text style={g.homeCardLabel}>Email</Text>
            <Text style={g.homeCardValue}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[g.dangerButton, isLoading && g.buttonDisabled]}
          onPress={logout}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={g.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
