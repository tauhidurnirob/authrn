export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Home: undefined;
};

export type RootStackParamList = AuthStackParamList & MainStackParamList;
