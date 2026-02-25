import type { FormSchema } from '../../types/form';
import type { SignupModel } from './types';

export const INITIAL_MODEL: SignupModel = {
  name: '',
  email: '',
  password: '',
};

export const signupSchema: FormSchema<SignupModel> = [
  {
    key: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    autoCapitalize: 'words',
    validations: [
      { type: 'required', message: 'Full name is required' },
    ],
  },
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
    placeholder: 'Min. 6 characters',
    validations: [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' },
      {
        type: 'custom',
        fn: (v, model) =>
          v === model.name ? 'Password should not match your name' : undefined,
      },
    ],
  },
];
