import type { KeyboardTypeOptions } from 'react-native';

export type ValidationRule<T extends Record<string, string>> =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; regex: RegExp; message?: string }
  | { type: 'custom'; fn: (value: string, model: T) => string | undefined };

export interface FieldSchema<T extends Record<string, string> = Record<string, string>> {
  key: keyof T & string;
  type?: 'text' | 'email' | 'password';
  label?: string;
  computedLabel?: (model: T) => string;
  placeholder?: string;
  computedPlaceholder?: (model: T) => string;
  computedValue?: (raw: string, model: T) => string;
  validations?: ValidationRule<T>[];
  visible?: (model: T) => boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  keyboardType?: KeyboardTypeOptions;
}

export type FormSchema<T extends Record<string, string>> = FieldSchema<T>[];

