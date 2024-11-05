import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { LOG } from "~/config";
import { ApiService } from "~/network/api/services/ApiService";
import { persistKeys } from "~/network/constant";
import { Chapter } from "~/types/chapter";
import { CurrentUser } from "~/types/current-user";
import { handleApiError } from "~/utils/common";
import { AppContext } from "./AppContext";
import { AppNavigation } from "./AppNavigation";
import {
  AuthContext,
  AuthDispatchContext,
  HandleSignInUnverifiedProps,
} from "./AuthContext";
import { NotificationService } from "./NotificationService";

export default function Authentication() {
  const [chapterFilter, setChapterFilter] = useState<Chapter | null>(null);
  type AppState = {
    isLoading: boolean;
    isSignout: boolean;
    accessToken?: string;
    refreshToken?: string;
    myUserId?: string;
    myEmail?: string;
    password?: string;
  };

  type SignIn = { type: "SIGN_IN"; user: CurrentUser };
  type RestoreToken = {
    type: "RESTORE_TOKENS";
    accessToken: string;
    refreshToken?: string;
    userId: string;
  };
  type SignOut = { type: "SIGN_OUT" };
  type SignInUnverified = {
    type: "SIGN_IN_UNVERIFIED";
    email: string;
    password: string;
  };

  type AppActions = SignIn | RestoreToken | SignOut | SignInUnverified;

  const [state, dispatch] = useReducer(
    (prevState: AppState, action: AppActions): AppState => {
      LOG.debug("handling action", action.type);
      switch (action.type) {
        case "RESTORE_TOKENS":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            myUserId: action.userId,
            isLoading: false,
            password: undefined,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            accessToken: action.user?.accessToken ?? undefined,
            refreshToken: action.user.refreshToken,
            myUserId: action.user.id,
            password: undefined,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            isLoading: false,
            accessToken: undefined,
            refreshToken: undefined,
            myUserId: undefined,
            password: undefined,
          };
        case "SIGN_IN_UNVERIFIED":
          return {
            ...prevState,
            isSignout: false,
            myEmail: action.email,
            password: action.password,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      try {
        const [userId, accessToken, refreshToken] = await Promise.all([
          AsyncStorage.getItem(persistKeys.myId),
          AsyncStorage.getItem(persistKeys.token),
          AsyncStorage.getItem(persistKeys.refreshToken),
        ]);

        if (userId && accessToken) {
          dispatch({
            type: "RESTORE_TOKENS",
            accessToken,
            refreshToken: refreshToken || undefined,
            userId,
          });
        } else {
          dispatch({
            type: "SIGN_OUT",
          });
        }
      } catch (e: unknown) {
        handleApiError("Failed to restore tokens", e as Error);
      }
    };

    void bootstrapAsync();
  }, []);

  const appContext = useMemo(() => ({}), []);

  const authDispatchContext = useMemo(
    () => ({
      handleSignIn: async (user: CurrentUser) => {
        await Promise.all([
          AsyncStorage.setItem(persistKeys.myId, user.id),
          AsyncStorage.setItem(persistKeys.myEmail, user.email),
          AsyncStorage.setItem(persistKeys.token, user.accessToken),
          AsyncStorage.setItem(persistKeys.refreshToken, user.refreshToken),
        ]);
        dispatch({ type: "SIGN_IN", user });
      },
      handleSignInUnverified: async ({
        email,
        password,
      }: HandleSignInUnverifiedProps) => {
        await AsyncStorage.setItem(persistKeys.myEmail, email);
        dispatch({ type: "SIGN_IN_UNVERIFIED", email, password });
      },

      handleSignOut: async () => {
        await Promise.all([
          AsyncStorage.removeItem(persistKeys.myId),
          AsyncStorage.removeItem(persistKeys.token),
          AsyncStorage.removeItem(persistKeys.refreshToken),
        ]);
        dispatch({ type: "SIGN_OUT" });
      },
      handleSignUp: async (user: CurrentUser) => {
        await Promise.all([AsyncStorage.setItem(persistKeys.myId, user.id)]);
        dispatch({ type: "SIGN_IN", user });
      },
    }),
    []
  );

  return (
    <AppContext.Provider
      value={{
        chapterFilter,
        setChapterFilter,
      }}
    >
      <AuthContext.Provider value={state}>
        <AuthDispatchContext.Provider value={authDispatchContext}>
          <ApiService>
            <NotificationService>
              <AppNavigation
                email={state.myEmail}
                password={state.password}
                token={state.accessToken}
              />
            </NotificationService>
          </ApiService>
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
    </AppContext.Provider>
  );
}
