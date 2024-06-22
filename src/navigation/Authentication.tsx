import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useReducer } from "react";
import { LOG } from "~/config";
import { ApiService } from "~/network/api/services/ApiService";
import { persistKeys } from "~/network/constant";
import { CurrentUser as MyUser } from "~/types/current-user";
import { handleApiError } from "~/utils/common";
import { AppNavigation } from "./AppNavigation";
import { AuthContext, AuthDispatchContext } from "./AuthContext";
import { NotificationService } from "./NotificationService";

export default function Authentication() {
  type AppState = {
    isLoading: boolean;
    isSignout: boolean;
    accessToken?: string;
    refreshToken?: string;
    myUserId?: string;
  };

  type SignIn = { type: "SIGN_IN"; user: MyUser };
  type RestoreToken = {
    type: "RESTORE_TOKENS";
    accessToken: string;
    refreshToken?: string;
    userId: string;
  };
  type SignOut = { type: "SIGN_OUT" };

  type AppActions = SignIn | RestoreToken | SignOut;

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
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            accessToken: action.user.accessToken,
            refreshToken: action.user.refreshToken,
            myUserId: action.user.id,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            isLoading: false,
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

        if (accessToken && userId) {
          dispatch({
            type: "RESTORE_TOKENS",
            accessToken,
            refreshToken: refreshToken || undefined,
            userId,
          });
        }

        if (!(userId && accessToken)) {
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

  const authDispatchContext = useMemo(
    () => ({
      handleSignIn: async (user: MyUser) => {
        await Promise.all([
          AsyncStorage.setItem(persistKeys.myId, user.id),
          AsyncStorage.setItem(persistKeys.token, user.accessToken),
          AsyncStorage.setItem(persistKeys.refreshToken, user.refreshToken),
        ]);
        dispatch({ type: "SIGN_IN", user });
      },
      handleSignOut: async () => {
        await Promise.all([
          AsyncStorage.removeItem(persistKeys.myId),
          AsyncStorage.removeItem(persistKeys.token),
          AsyncStorage.removeItem(persistKeys.refreshToken),
        ]);
        dispatch({ type: "SIGN_OUT" });
      },
      handleSignUp: async (user: MyUser) => {
        await Promise.all([
          AsyncStorage.setItem(persistKeys.myId, user.id),
          AsyncStorage.setItem(persistKeys.token, user.accessToken),
          AsyncStorage.setItem(persistKeys.refreshToken, user.refreshToken),
        ]);
        dispatch({ type: "SIGN_IN", user });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={state}>
      <ApiService>
        <AuthDispatchContext.Provider value={authDispatchContext}>
          <NotificationService>
            <AppNavigation token={state.accessToken} />
          </NotificationService>
        </AuthDispatchContext.Provider>
      </ApiService>
    </AuthContext.Provider>
  );
}
