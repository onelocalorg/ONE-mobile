import { createContext, useContext } from "react";
import { CurrentUser } from "~/types/current-user";

// type AuthContextType = {
//   accessToken?: string;
//   myUser?: CurrentUser;
//   myUserId?: string;
// };

export type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  accessToken?: string;
  refreshToken?: string;
  myUserId?: string;
  myEmail?: string;
  password?: string;
};

export const AuthContext = createContext<AuthState | null>(null);

export interface HandleSignInUnverifiedProps {
  email: string;
  password: string;
}

type AuthDispatchContextType = {
  handleSignIn: (user: CurrentUser) => void;
  handleSignInUnverified: ({
    email,
    password,
  }: HandleSignInUnverifiedProps) => void;
  handleSignOut: () => void;
  handleSignUp: (user: CurrentUser) => void;
};

export const AuthDispatchContext = createContext<AuthDispatchContextType>({
  handleSignIn: () => {},
  handleSignInUnverified: () => {},
  handleSignOut: () => {},
  handleSignUp: () => {},
});

export function useAccessToken() {
  return useContext(AuthContext)?.accessToken;
}

export function useMyUserId() {
  return useContext(AuthContext)?.myUserId;
}
