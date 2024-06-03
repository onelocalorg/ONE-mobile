import { ForgotPassword } from "~/types/forgot-password";
import { doPost } from "./api-service";

export const forgotPassword = (email: string) =>
  doPost<ForgotPassword>(`/v1/auth/forgot-password`, { email });

export const verifyOtp = (otp: string, otpUniqueKey: string) =>
  doPost<boolean>(`/v1/auth/verify-otp`, { otp, otpUniqueKey });

export const resetPassword = (
  password: string,
  otp: string,
  otpUniqueKey: string
) =>
  doPost<never>(`/v1/auth/reset-password`, {
    password,
    otp,
    otpUniqueKey,
  });
