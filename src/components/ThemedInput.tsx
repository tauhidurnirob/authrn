import React, { memo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '../context/ThemeContext';

interface ThemedInputProps extends TextInputProps {
  isPassword?: boolean;
}

export const ThemedInput = memo<ThemedInputProps>(function ThemedInput({
  isPassword = false,
  style,
  ...props
}) {
  const { styles: g, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isPassword) {
    return (
      <View style={[g.input, g.inputRow, focused && g.inputFocused]}>
        <TextInput
          style={[g.passwordInput, style]}
          placeholderTextColor={colors.textPlaceholder}
          {...props}
          secureTextEntry={!showPassword}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        />
        <TouchableOpacity
          style={g.eyeButton}
          onPress={() => setShowPassword(v => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      style={[g.input, focused && g.inputFocused, style]}
      placeholderTextColor={colors.textPlaceholder}
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
    />
  );
});
