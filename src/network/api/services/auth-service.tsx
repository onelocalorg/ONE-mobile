import { CurrentUser } from "~/types/current-user";
import { ForgotPassword } from "~/types/forgot-password";
import { NewUser } from "~/types/new-user";
import { doGet, doPost } from "./api-service";

interface LoginProps {
  emailOrMobile: string;
  password: string;
  loginType: string;
  deviceToken: string;
  version: string;
  deviceInfo: string;
  googleToken: string;
}

export const logIn = async (props: LoginProps) =>
  doPost<CurrentUser>("/v1/auth/login", props);

export const signUp = async (props: NewUser) =>
  doPost<CurrentUser>("/v1/auth/signup", props);

interface GoogleLoginProps {
  id: string;
  email: string;
  googleAuth?: string;
  first_name?: string;
  last_name?: string;
  pic?: string;
}
export const googleLogin = async (props: GoogleLoginProps) =>
  doPost<CurrentUser>("/v1/auth/googleSignupLogin", props);

interface AppleLoginProps {
  nonce: string;
  user: string;
  identityToken?: string;
  email?: string;
  authorizationCode: string;
  givenName?: string;
  familyName?: string;
  nickName?: string;
}
export const appleLogin = async (props: AppleLoginProps) =>
  doPost<CurrentUser>("/v1/auth/appleSignupLogin", props);

export const forgotPassword = (email: string) =>
  doPost<ForgotPassword>(`/v1/auth/forgot-password`, { email });

export const verifyOtp = (otp: string, otpUniqueKey: string) =>
  doPost<boolean>(`/v1/auth/verify-otp`, { otp, otpUniqueKey });

export const authPing = () => doGet<never>("/v1/auth/ping");

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
