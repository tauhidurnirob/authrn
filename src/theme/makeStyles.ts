import { StyleSheet } from 'react-native';
import type { ColorPalette } from './palette';

export const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    safe:  { flex: 1, backgroundColor: c.background },
    flex:  { flex: 1 },
    splash: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: c.background,
    },

    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
      paddingVertical: 40,
    },
    headerContainer: { marginBottom: 32 },
    screenTitle: {
      fontSize: 34,
      fontWeight: '700',
      color: c.text,
      letterSpacing: -0.5,
    },
    screenSubtitle: { fontSize: 16, color: c.textMuted, marginTop: 6 },

    errorBox: {
      backgroundColor: c.dangerLight,
      borderLeftWidth: 4,
      borderLeftColor: c.danger,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    errorText: { color: c.dangerText, fontSize: 14 },
    fieldError: { color: c.dangerText, fontSize: 12, marginTop: 4, marginLeft: 2 },

    form: { marginBottom: 28 },
    inputLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textLabel,
      marginBottom: 6,
      marginTop: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: c.text,
      // Pre-create compositing layers at mount so focus is a value-only update.
      elevation: 0,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 4,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 0,
      elevation: 0,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 4,
    },
    inputFocused: {
      borderColor: c.primary,
      elevation: 4,
      shadowOpacity: 0.15,
    },
    passwordInput: {
      flex: 1,
      fontSize: 15,
      color: c.text,
      paddingVertical: 14,
    },
    eyeButton: { paddingRight: 4, paddingVertical: 14, justifyContent: 'center' },

    button: {
      backgroundColor: c.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    dangerButton: {
      backgroundColor: c.danger,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },

    link:       { textAlign: 'center', color: c.textMuted, fontSize: 14 },
    linkAccent: { color: c.primary, fontWeight: '600' },

    homeContainer: {
      flex: 1,
      paddingHorizontal: 28,
      paddingVertical: 32,
      justifyContent: 'space-between',
    },
    homeTopSection: { alignItems: 'center', marginTop: 32 },
    homeAvatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: c.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    homeAvatarText: { color: '#ffffff', fontSize: 32, fontWeight: '700' },
    homeGreeting:   { fontSize: 18, color: c.textMuted },
    homeName: {
      fontSize: 30,
      fontWeight: '700',
      color: c.text,
      letterSpacing: -0.5,
      marginTop: 4,
    },
    homeCard: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    homeCardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
    },
    homeDivider:   { height: 1, backgroundColor: c.divider },
    homeCardLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textMeta,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    homeCardValue: {
      fontSize: 15,
      color: c.text,
      fontWeight: '500',
      flexShrink: 1,
      textAlign: 'right',
    },
  });

export type AppStyles = ReturnType<typeof makeStyles>;
