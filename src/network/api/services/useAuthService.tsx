import { AppleRequestResponse } from "@invertase/react-native-apple-authentication";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { CurrentUser } from "~/types/current-user";
import { ForgotPassword } from "~/types/forgot-password";
import { NewUser } from "~/types/new-user";
import { UserProfile } from "~/types/user-profile";
import { useApiService } from "./ApiService";
import { useUserService } from "./useUserService";

export enum AuthMutations {
  logIn = "logIn",
  signUp = "signUp",
  verifyEmail = "verifyEmail",
  forgotPassword = "forgotPassword",
  verifyOtp = "verifyOtp",
  resetPassword = "resetPassword",
  appleLogin = "applyLogin",
  googleLogin = "googleLogin",
}

export function useAuthService() {
  const queryClient = useQueryClient();
  const { doGet, doPost } = useApiService();
  const { queries: userQueries } = useUserService();

  GoogleSignin.configure({
    iosClientId: process.env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
    webClientId: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
    offlineAccess: true,
  });

  queryClient.setMutationDefaults([AuthMutations.logIn], {
    mutationFn: (data: LoginProps) => {
      return logIn(data);
    },
    onError: () => {
      // LoginScreen will handle the various error cases
    },
  });

  queryClient.setMutationDefaults([AuthMutations.appleLogin], {
    mutationFn: (data: AppleRequestResponse) => {
      return appleLogin(data);
    },
  });

  queryClient.setMutationDefaults([AuthMutations.googleLogin], {
    mutationFn: (data: User) => {
      return googleLogin(data);
    },
  });

  queryClient.setMutationDefaults([AuthMutations.signUp], {
    mutationFn: (data: NewUser) => {
      return signUp(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userQueries.lists(),
      });
    },
  });

  queryClient.setMutationDefaults([AuthMutations.verifyEmail], {
    mutationFn: (data: VerifyEmailProps) => {
      return verifyEmail(data);
    },
  });

  queryClient.setMutationDefaults([AuthMutations.forgotPassword], {
    mutationFn: (email: string) => {
      return forgotPassword(email);
    },
    onError: () => {
      Alert.alert("Email not found", "Please check your email and try again.");
    },
  });

  queryClient.setMutationDefaults([AuthMutations.verifyOtp], {
    mutationFn: (data: VerifyOtpProps) => {
      return verifyOtp(data);
    },
  });

  queryClient.setMutationDefaults([AuthMutations.resetPassword], {
    mutationFn: (data: ResetPasswordProps) => {
      return resetPassword(data);
    },
  });

  const logIn = async (props: LoginProps) =>
    doPost<CurrentUser>("/v3/auth/login", props);

  const signUp = async (props: NewUser) =>
    doPost<UserProfile>("/v3/auth/signup", props);

  const googleLogin = async (props: User) =>
    doPost<CurrentUser>("/v3/auth/google-login", props);

  const appleLogin = async (props: AppleRequestResponse) =>
    doPost<CurrentUser>("/v3/auth/apple-login", props);

  const verifyEmail = (props: VerifyEmailProps) =>
    doGet<CurrentUser>(
      `/v3/auth/verify-email?email=${encodeURIComponent(props.email)}&token=${
        props.token
      }`
    );

  const resendEmailVerification = (email: string) =>
    doGet<never>(
      `/v3/auth/resend-email-verification?email=${encodeURIComponent(email)}`
    );

  const forgotPassword = (email: string) =>
    doPost<ForgotPassword>(`/v3/auth/forgot-password`, { email });

  const verifyOtp = (props: VerifyOtpProps) =>
    doPost<boolean>(`/v3/auth/verify-otp`, props);

  const resetPassword = (props: ResetPasswordProps) =>
    doPost<never>(`/v3/auth/reset-password`, props);

  return {
    resendEmailVerification,
  };
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface VerifyEmailProps {
  email: string;
  token: string;
}

export interface VerifyOtpProps {
  otp: string;
  otpKey: string;
}

export interface ResetPasswordProps {
  password: string;
  otp: string;
  otpKey: string;
}
