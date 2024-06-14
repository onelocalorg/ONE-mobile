import { createContext } from "react";
import { CurrentUser } from "~/types/current-user";
import { UserProfile } from "~/types/user-profile";

type AuthContextType = {
  myProfile: UserProfile | null;
  accessToken: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  myProfile: null,
  accessToken: null,
});

type AuthDispatchContextType = {
  handleSignIn: (user: CurrentUser) => void;
  handleSignOut: () => void;
  handleSignUp: (user: CurrentUser) => void;
};

export const AuthDispatchContext = createContext<AuthDispatchContextType>({
  handleSignIn: () => {},
  handleSignOut: () => {},
  handleSignUp: () => {},
});
