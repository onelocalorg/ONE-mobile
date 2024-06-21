import { CurrentUser } from "~/types/current-user";
import { ForgotPassword } from "~/types/forgot-password";
import { NewUser } from "~/types/new-user";
import { useApiService } from "./ApiService";

export function useAuthService() {
  const { doGet, doPost } = useApiService();

  interface LoginProps {
    emailOrMobile: string;
    password: string;
    loginType: string;
    version: string;
    deviceInfo: string;
  }

  const logIn = async (props: LoginProps) =>
    doPost<CurrentUser>("/v3/auth/login", props);

  const signUp = async (props: NewUser) =>
    doPost<CurrentUser>("/v3/auth/signup", props);

  interface GoogleLoginProps {
    id: string;
    email: string;
    googleAuth?: string;
    first_name?: string;
    last_name?: string;
    pic?: string;
  }
  const googleLogin = async (props: GoogleLoginProps) =>
    doPost<CurrentUser>("/v3/auth/googleSignupLogin", props);

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
  const appleLogin = async (props: AppleLoginProps) =>
    doPost<CurrentUser>("/v3/auth/appleSignupLogin", props);

  const forgotPassword = (email: string) =>
    doPost<ForgotPassword>(`/v3/auth/forgot-password`, { email });

  const verifyOtp = (otp: string, otpUniqueKey: string) =>
    doPost<boolean>(`/v3/auth/verify-otp`, { otp, otpUniqueKey });

  const authPing = () => doGet<never>("/v3/auth/ping");

  const resetPassword = (password: string, otp: string, otpUniqueKey: string) =>
    doPost<never>(`/v3/auth/reset-password`, {
      password,
      otp,
      otpUniqueKey,
    });

  return {
    logIn,
    signUp,
    googleLogin,
    appleLogin,
  };
}
