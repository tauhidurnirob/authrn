export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string) => {
  return typeof password === 'string' && password.length >= 6;
};

export const isNonEmpty = (value: string) => {
  return typeof value === 'string' && value.trim().length > 0;
};
