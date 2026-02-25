import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

export type SignupModel = {
  name: string;
  email: string;
  password: string;
};

export type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
