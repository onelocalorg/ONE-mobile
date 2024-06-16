import { CurrentUser } from "~/types/current-user";
import { ForgotPassword } from "~/types/forgot-password";
import { NewUser } from "~/types/new-user";
import { useApiService } from "./api-service";

export function useAuthService() {
  const { doGet, doPost } = useApiService();

  interface LoginProps {
    emailOrMobile: string;
    password: string;
    loginType: string;
    deviceToken: string;
    version: string;
    deviceInfo: string;
    googleToken: string;
  }

  const logIn = async (props: LoginProps) =>
    doPost<CurrentUser>("/v1/auth/login", props);

  const signUp = async (props: NewUser) =>
    doPost<CurrentUser>("/v1/auth/signup", props);

  interface GoogleLoginProps {
    id: string;
    email: string;
    googleAuth?: string;
    first_name?: string;
    last_name?: string;
    pic?: string;
  }
  const googleLogin = async (props: GoogleLoginProps) =>
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
  const appleLogin = async (props: AppleLoginProps) =>
    doPost<CurrentUser>("/v1/auth/appleSignupLogin", props);

  const forgotPassword = (email: string) =>
    doPost<ForgotPassword>(`/v1/auth/forgot-password`, { email });

  const verifyOtp = (otp: string, otpUniqueKey: string) =>
    doPost<boolean>(`/v1/auth/verify-otp`, { otp, otpUniqueKey });

  const authPing = () => doGet<never>("/v1/auth/ping");

  const resetPassword = (password: string, otp: string, otpUniqueKey: string) =>
    doPost<never>(`/v1/auth/reset-password`, {
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
