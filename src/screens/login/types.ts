import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

export type LoginModel = {
  email: string;
  password: string;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
