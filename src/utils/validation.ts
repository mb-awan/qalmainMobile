const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_NAME_LENGTH = 2;
export const OTP_LENGTH = 6;

export function validateEmail(email: string): string | null {
  const t = email.trim();
  if (!t) return 'Email is required.';
  if (t.length > 254) return 'Email is too long.';
  if (!EMAIL_RE.test(t)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > 128) return 'Password is too long.';
  if (!/[a-z]/.test(password)) {
    return 'Include at least one lowercase letter.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Include at least one uppercase letter.';
  }
  if (!/\d/.test(password)) return 'Include at least one number.';
  return null;
}

export function validateName(name: string): string | null {
  const t = name.trim();
  if (t.length > 0 && t.length < MIN_NAME_LENGTH) {
    return `Name should be at least ${MIN_NAME_LENGTH} characters.`;
  }
  if (t.length > 80) return 'Name is too long.';
  return null;
}

export function validateOtp(code: string): string | null {
  const d = code.replace(/\s/g, '');
  if (!d) return 'Enter the verification code.';
  if (!/^\d{6}$/.test(d)) return 'Code must be 6 digits.';
  return null;
}
