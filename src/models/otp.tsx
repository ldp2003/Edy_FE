/**
 * OTP Model for Frontend
 */
export interface OTPRequest {
  email: string;
  type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL";
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
  type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL";
}

export interface OTPResponse {
  success?: boolean;
  message: string;
  error?: string;
  status?: number;
}

export interface RegisterWithOTPRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  otp: string;
}
