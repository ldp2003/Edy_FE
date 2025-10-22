/**
 * Validation utilities for email and password
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: "Vui lòng nhập email!" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không hợp lệ!" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate password strength for registration
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 special character
 * - At least 1 number
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Vui lòng nhập mật khẩu!" };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 8 ký tự!" };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa!",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải chứa ít nhất 1 số!" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate password confirmation matches original password
 */
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: "Vui lòng xác nhận mật khẩu!" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Mật khẩu xác nhận không khớp!" };
  }

  return { isValid: true, message: "" };
};

/**
 * Combined validation for registration form
 */
export const validateRegistrationForm = (values: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmail(values.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  const passwordValidation = validatePassword(values.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  const confirmValidation = validatePasswordConfirm(
    values.password,
    values.confirmPassword
  );
  if (!confirmValidation.isValid) {
    errors.confirm = confirmValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
