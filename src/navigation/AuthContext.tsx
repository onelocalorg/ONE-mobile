import { createContext, useContext } from "react";
import { CurrentUser } from "~/types/current-user";

type AuthContextType = {
  accessToken?: string;
  myUserId?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

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
