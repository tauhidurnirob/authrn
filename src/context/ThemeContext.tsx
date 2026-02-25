import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorPalette } from '../theme/palette';
import { makeStyles, type AppStyles } from '../theme/makeStyles';

export type ColorScheme = 'light' | 'dark';

export interface ThemeContextValue {
  colors: ColorPalette;
  styles: AppStyles;
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  const colors = useMemo<ColorPalette>(
    () => (colorScheme === 'dark' ? darkColors : lightColors),
    [colorScheme],
  );

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const value = useMemo(
    () => ({ colors, styles, colorScheme }),
    [colors, styles, colorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};

