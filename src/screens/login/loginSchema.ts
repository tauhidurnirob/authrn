import type { FormSchema } from '../../types/form';
import type { LoginModel } from './types';

export const INITIAL_MODEL: LoginModel = {
  email: '',
  password: '',
};

export const loginSchema: FormSchema<LoginModel> = [
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    autoCapitalize: 'none',
    keyboardType: 'email-address',
    computedValue: v => v.toLowerCase().trim(),
    validations: [
      { type: 'required', message: 'Email is required' },
      {
        type: 'pattern',
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email address',
      },
    ],
  },
  {
    key: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    validations: [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' },
    ],
  },
];
