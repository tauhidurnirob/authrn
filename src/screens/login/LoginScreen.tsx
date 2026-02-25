import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FormBuilder, type FormBuilderRef } from '../../components/FormBuilder';
import { loginSchema, INITIAL_MODEL } from './loginSchema';
import type { LoginScreenNavigationProp, LoginModel } from './types';

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const { styles: g } = useTheme();
  const formRef = useRef<FormBuilderRef>(null);

  const [model, setModel] = useState<LoginModel>(INITIAL_MODEL);
  const [serverError, setServerError] = useState('');

  const handleLogin = async () => {
    setServerError('');
    if (!formRef.current?.validate()) return;
    try {
      await login(model.email, model.password);
    } catch (e: any) {
      setServerError(e.message ?? 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={g.safe}>
      <KeyboardAvoidingView
        style={g.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={g.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={g.headerContainer}>
            <Text style={g.screenTitle}>Welcome Back</Text>
            <Text style={g.screenSubtitle}>Sign in to continue</Text>
          </View>

          {serverError !== '' && (
            <View style={g.errorBox}>
              <Text style={g.errorText}>{serverError}</Text>
            </View>
          )}

          <FormBuilder
            ref={formRef}
            schema={loginSchema}
            model={model}
            onChange={updated => { setModel(updated); setServerError(''); }}
            disabled={isLoading}
          />

          <TouchableOpacity
            style={[g.button, isLoading && g.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={g.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            disabled={isLoading}
            style={{ marginTop: 24 }}
          >
            <Text style={g.link}>
              Don't have an account?{' '}
              <Text style={g.linkAccent}>Go to Signup</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
