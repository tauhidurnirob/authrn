import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemedInput } from './ThemedInput';
import type { FormSchema, FieldSchema, ValidationRule } from '../types/form';

export interface FormBuilderRef {
  validate(): boolean;
  clearErrors(): void;
}

interface FormBuilderProps<T extends Record<string, string>> {
  schema: FormSchema<T>;
  model: T;
  onChange: (model: T) => void;
  disabled?: boolean;
}

export function runFieldValidation<T extends Record<string, string>>(
  field: FieldSchema<T>,
  value: string,
  model: T,
): string | undefined {
  const label = field.label ?? field.key;
  for (const rule of field.validations ?? []) {
    switch (rule.type) {
      case 'required':
        if (!value.trim()) return rule.message ?? `${label} is required`;
        break;
      case 'minLength':
        if (value.length < rule.value)
          return rule.message ?? `${label} must be at least ${rule.value} characters`;
        break;
      case 'maxLength':
        if (value.length > rule.value)
          return rule.message ?? `${label} must be at most ${rule.value} characters`;
        break;
      case 'pattern':
        if (!rule.regex.test(value))
          return rule.message ?? `${label} format is invalid`;
        break;
      case 'custom': {
        const msg = (rule as Extract<ValidationRule<T>, { type: 'custom' }>).fn(value, model);
        if (msg) return msg;
        break;
      }
    }
  }
  return undefined;
}

function FormBuilderInner<T extends Record<string, string>>(
  { schema, model, onChange, disabled = false }: FormBuilderProps<T>,
  ref: React.ForwardedRef<FormBuilderRef>,
) {
  const { styles: g } = useTheme();
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const modelRef = useRef(model);
  modelRef.current = model;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handlersRef = useRef<Record<string, (raw: string) => void>>({});
  for (const field of schema) {
    const key = field.key as string;
    if (!handlersRef.current[key]) {
      handlersRef.current[key] = (raw: string) => {
        const m = modelRef.current;
        const value = field.computedValue ? field.computedValue(raw, m) : raw;
        onChangeRef.current({ ...m, [field.key]: value });
        setErrors(prev =>
          prev[field.key] ? { ...prev, [field.key]: undefined } : prev,
        );
      };
    }
  }

  useImperativeHandle(ref, () => ({
    validate() {
      const newErrors: Partial<Record<keyof T, string>> = {};
      let valid = true;
      for (const field of schema) {
        if (field.visible?.(model) === false) continue;
        const err = runFieldValidation(field, model[field.key] ?? '', model);
        if (err) {
          newErrors[field.key] = err;
          valid = false;
        }
      }
      setErrors(newErrors);
      return valid;
    },
    clearErrors() {
      setErrors({});
    },
  }));

  return (
    <View style={g.form}>
      {schema.map(field => {
        if (field.visible?.(model) === false) return null;

        const label =
          field.computedLabel?.(model) ?? field.label ?? field.key;
        const placeholder =
          field.computedPlaceholder?.(model) ?? field.placeholder ?? '';
        const isPassword = field.type === 'password';
        const fieldError = errors[field.key];

        return (
          <View key={field.key}>
            <Text style={g.inputLabel}>{label}</Text>

            <ThemedInput
              value={model[field.key] ?? ''}
              onChangeText={handlersRef.current[field.key as string]}
              placeholder={placeholder}
              autoCapitalize={field.autoCapitalize ?? 'none'}
              keyboardType={field.keyboardType ?? 'default'}
              isPassword={isPassword}
              editable={!disabled}
            />

            {fieldError ? (
              <Text style={g.fieldError}>{fieldError}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export const FormBuilder = forwardRef(FormBuilderInner) as <
  T extends Record<string, string>,
>(
  props: FormBuilderProps<T> & { ref?: React.Ref<FormBuilderRef> },
) => React.ReactElement;
