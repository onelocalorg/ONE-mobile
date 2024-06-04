import { CurrentUser } from "~/types/current-user";
import { ForgotPassword } from "~/types/forgot-password";
import { doPost } from "./api-service";

interface LoginProps {
  emailOrMobile: string;
  password: string;
  loginType: string;
  deviceToken: string;
  version: string;
  deviceInfo: string;
  googleToken: string;
}

export const login = async (props: LoginProps) =>
  doPost<CurrentUser>("/v1/auth/login", props);

interface GoogleLoginProps {
  email: string;
  googleAuth: string | null;
  first_name?: string | null;
  last_name?: string | null;
  pic?: string | null;
}
export const googleLogin = async (props: GoogleLoginProps) =>
  doPost<CurrentUser>("/v1/auth/googleSignupLogin", props);

interface AppleLoginProps {
  nonce: string;
  user: string;
  identityToken: string | null;
  email: string | null;
  authorizationCode: string | null;
  givenName?: string | null;
  familyName?: string | null;
  nickName?: string | null;
}
export const appleLogin = async (props: AppleLoginProps) =>
  doPost<CurrentUser>("/v1/auth/appleSignupLogin", props);

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
