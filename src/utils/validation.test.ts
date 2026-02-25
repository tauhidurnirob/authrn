import { isValidEmail, isValidPassword, isNonEmpty } from './validation';

describe('isValidEmail', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts subdomains', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects whitespace in address', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts exactly 6 characters', () => {
    expect(isValidPassword('abc123')).toBe(true);
  });

  it('accepts more than 6 characters', () => {
    expect(isValidPassword('supersecure')).toBe(true);
  });

  it('rejects 5 characters', () => {
    expect(isValidPassword('abc12')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });
});

describe('isNonEmpty', () => {
  it('accepts normal text', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('accepts text with surrounding spaces', () => {
    expect(isNonEmpty('  hello  ')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });
});
