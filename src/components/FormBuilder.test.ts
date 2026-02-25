import { runFieldValidation } from './FormBuilder';
import { loginSchema } from '../screens/login/loginSchema';
import { signupSchema } from '../screens/signup/signupSchema';
import type { FieldSchema } from '../types/form';

// ─── runFieldValidation — rule unit tests ─────────────────────────────────────

type M = Record<string, string>;

describe('runFieldValidation — required', () => {
  const field: FieldSchema<M> = { key: 'x', validations: [{ type: 'required' }] };

  it('fails empty string', () => {
    expect(runFieldValidation(field, '', {})).toBe('x is required');
  });

  it('fails whitespace-only', () => {
    expect(runFieldValidation(field, '   ', {})).toBe('x is required');
  });

  it('passes non-empty value', () => {
    expect(runFieldValidation(field, 'hello', {})).toBeUndefined();
  });

  it('uses custom message', () => {
    const f: FieldSchema<M> = { key: 'x', validations: [{ type: 'required', message: 'Required!' }] };
    expect(runFieldValidation(f, '', {})).toBe('Required!');
  });
});

describe('runFieldValidation — minLength', () => {
  const field: FieldSchema<M> = { key: 'x', validations: [{ type: 'minLength', value: 4 }] };

  it('fails shorter value', () => {
    expect(runFieldValidation(field, 'abc', {})).toMatch(/4/);
  });

  it('passes at exact length', () => {
    expect(runFieldValidation(field, 'abcd', {})).toBeUndefined();
  });

  it('passes longer value', () => {
    expect(runFieldValidation(field, 'abcde', {})).toBeUndefined();
  });
});

describe('runFieldValidation — maxLength', () => {
  const field: FieldSchema<M> = { key: 'x', validations: [{ type: 'maxLength', value: 3 }] };

  it('fails over limit', () => {
    expect(runFieldValidation(field, 'abcd', {})).toMatch(/3/);
  });

  it('passes at exact limit', () => {
    expect(runFieldValidation(field, 'abc', {})).toBeUndefined();
  });
});

describe('runFieldValidation — pattern', () => {
  const field: FieldSchema<M> = { key: 'x', validations: [{ type: 'pattern', regex: /^\d+$/ }] };

  it('fails non-matching value', () => {
    expect(runFieldValidation(field, 'abc', {})).toBeTruthy();
  });

  it('passes matching value', () => {
    expect(runFieldValidation(field, '123', {})).toBeUndefined();
  });
});

describe('runFieldValidation — custom', () => {
  const field: FieldSchema<M> = {
    key: 'x',
    validations: [{
      type: 'custom',
      fn: (v, m) => v === m.other ? 'Must differ from other' : undefined,
    }],
  };

  it('fails when fn returns a message', () => {
    expect(runFieldValidation(field, 'same', { other: 'same' })).toBe('Must differ from other');
  });

  it('passes when fn returns undefined', () => {
    expect(runFieldValidation(field, 'different', { other: 'same' })).toBeUndefined();
  });
});

describe('runFieldValidation — multiple rules', () => {
  const field: FieldSchema<M> = {
    key: 'x',
    validations: [
      { type: 'required' },
      { type: 'minLength', value: 5 },
    ],
  };

  it('returns the first failing rule message', () => {
    expect(runFieldValidation(field, '', {})).toBe('x is required');
  });

  it('continues to next rule when first passes', () => {
    expect(runFieldValidation(field, 'abc', {})).toMatch(/5/);
  });
});

// ─── loginSchema ─────────────────────────────────────────────────────────────

type LoginModel = { email: string; password: string };

const validateLogin = (key: keyof LoginModel, value: string) => {
  const field = loginSchema.find(f => f.key === key)!;
  return runFieldValidation(field, value, { email: '', password: '' });
};

describe('loginSchema — email', () => {
  it('requires a value', () => {
    expect(validateLogin('email', '')).toBe('Email is required');
  });

  it('rejects invalid format', () => {
    expect(validateLogin('email', 'not-an-email')).toBe('Enter a valid email address');
  });

  it('accepts a valid email', () => {
    expect(validateLogin('email', 'user@example.com')).toBeUndefined();
  });

  it('computedValue lowercases and trims the email', () => {
    const field = loginSchema.find(f => f.key === 'email')!;
    expect(field.computedValue!('  USER@EXAMPLE.COM  ', { email: '', password: '' }))
      .toBe('user@example.com');
  });
});

describe('loginSchema — password', () => {
  it('requires a value', () => {
    expect(validateLogin('password', '')).toBe('Password is required');
  });

  it('rejects fewer than 6 characters', () => {
    expect(validateLogin('password', 'abc')).toBe('Password must be at least 6 characters');
  });

  it('accepts 6+ characters', () => {
    expect(validateLogin('password', 'abc123')).toBeUndefined();
  });
});

// ─── signupSchema ─────────────────────────────────────────────────────────────

type SignupModel = { name: string; email: string; password: string };

const validateSignup = (key: keyof SignupModel, value: string, model?: SignupModel) => {
  const field = signupSchema.find(f => f.key === key)!;
  return runFieldValidation(field, value, model ?? { name: '', email: '', password: '' });
};

describe('signupSchema — name', () => {
  it('requires a value', () => {
    expect(validateSignup('name', '')).toBe('Full name is required');
  });

  it('accepts a non-empty name', () => {
    expect(validateSignup('name', 'Alice')).toBeUndefined();
  });
});

describe('signupSchema — email', () => {
  it('requires a value', () => {
    expect(validateSignup('email', '')).toBe('Email is required');
  });

  it('rejects invalid format', () => {
    expect(validateSignup('email', 'bad-email')).toBe('Enter a valid email address');
  });

  it('accepts a valid email', () => {
    expect(validateSignup('email', 'user@example.com')).toBeUndefined();
  });
});

describe('signupSchema — password', () => {
  it('requires a value', () => {
    expect(validateSignup('password', '')).toBe('Password is required');
  });

  it('rejects fewer than 6 characters', () => {
    expect(validateSignup('password', 'abc')).toBe('Password must be at least 6 characters');
  });

  it('rejects password matching the name', () => {
    // Use a password >= 6 chars so minLength passes and name-match rule is reached.
    expect(validateSignup('password', 'AliceX', { name: 'AliceX', email: '', password: '' }))
      .toBe('Password should not match your name');
  });

  it('accepts a valid password that differs from name', () => {
    expect(validateSignup('password', 'secure99', { name: 'Alice', email: '', password: '' }))
      .toBeUndefined();
  });
});
