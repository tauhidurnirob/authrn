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
import { signupSchema, INITIAL_MODEL } from './signupSchema';
import type { SignupScreenNavigationProp, SignupModel } from './types';

interface Props {
  navigation: SignupScreenNavigationProp;
}

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { signup, isLoading } = useAuth();
  const { styles: g } = useTheme();
  const formRef = useRef<FormBuilderRef>(null);

  const [model, setModel] = useState<SignupModel>(INITIAL_MODEL);
  const [serverError, setServerError] = useState('');

  const handleSignup = async () => {
    setServerError('');
    if (!formRef.current?.validate()) return;
    try {
      await signup(model.name, model.email, model.password);
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
            <Text style={g.screenTitle}>Create Account</Text>
            <Text style={g.screenSubtitle}>Sign up to get started</Text>
          </View>

          {serverError !== '' && (
            <View style={g.errorBox}>
              <Text style={g.errorText}>{serverError}</Text>
            </View>
          )}

          <FormBuilder
            ref={formRef}
            schema={signupSchema}
            model={model}
            onChange={updated => { setModel(updated); setServerError(''); }}
            disabled={isLoading}
          />

          <TouchableOpacity
            style={[g.button, isLoading && g.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={g.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
            style={{ marginTop: 24 }}
          >
            <Text style={g.link}>
              Already have an account?{' '}
              <Text style={g.linkAccent}>Go to Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
