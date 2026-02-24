import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Signup Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
