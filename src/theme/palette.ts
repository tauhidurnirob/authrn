export interface ColorPalette {
  primary: string;

  danger: string;
  dangerLight: string;
  dangerText: string;

  background: string;
  surface: string;

  text: string;
  textMuted: string;
  textLabel: string;
  textPlaceholder: string;
  textMeta: string;

  border: string;
  divider: string;
}

export const lightColors: ColorPalette = {
  primary: '#2563eb',

  danger: '#ef4444',
  dangerLight: '#fef2f2',
  dangerText: '#dc2626',

  background: '#f8f9fa',
  surface: '#ffffff',

  text: '#111111',
  textMuted: '#6b7280',
  textLabel: '#374151',
  textPlaceholder: '#aaaaaa',
  textMeta: '#9ca3af',

  border: '#e5e7eb',
  divider: '#f3f4f6',
};

export const darkColors: ColorPalette = {
  primary: '#3b82f6',

  danger: '#f87171',
  dangerLight: '#2d1515',
  dangerText: '#fca5a5',

  background: '#0f172a',
  surface: '#1e293b',

  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textLabel: '#cbd5e1',
  textPlaceholder: '#64748b',
  textMeta: '#64748b',

  border: '#334155',
  divider: '#1e293b',
};
