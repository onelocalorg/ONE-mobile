import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash/fp";
import React, { useEffect, useMemo, useReducer } from "react";
import { LOG } from "~/config";
import { getUserProfile } from "~/network/api/services/user-service";
import { persistKeys } from "~/network/constant";
import { CurrentUser as MyUser } from "~/types/current-user";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { AppNavigation } from "./AppNavigation";
import { AuthContext, AuthDispatchContext } from "./AuthContext";

export default function Authentication() {
  type AppState = {
    isLoading: boolean;
    isSignout: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    myProfile: UserProfile | null;
  };

  type SignIn = { type: "SIGN_IN"; user: MyUser };
  type RestoreToken = {
    type: "RESTORE_TOKENS";
    myProfile: UserProfile;
    accessToken: string | null;
    refreshToken: string | null;
  };
  type SignOut = { type: "SIGN_OUT" };

  type AppActions = SignIn | RestoreToken | SignOut;

  const [state, dispatch] = useReducer(
    (prevState: AppState, action: AppActions) => {
      LOG.debug("handling action", action.type);
      switch (action.type) {
        case "RESTORE_TOKENS":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            myProfile: _.omit(["access_token", "refresh_token"], action.user),
            accessToken: action.user.access_token,
            refreshToken: action.user.refresh_token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            myProfile: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      myProfile: null,
      accessToken: null,
      refreshToken: null,
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

        if (!(userId && accessToken)) {
          dispatch({
            type: "SIGN_OUT",
          });
        } else {
          const myProfile = await getUserProfile(userId);

          dispatch({
            type: "RESTORE_TOKENS",
            myProfile,
            accessToken,
            refreshToken,
          });
        }
      } catch (e) {
        handleApiError("Failed to restore tokens", e);
      }
    };

    bootstrapAsync();
  }, []);

  const authDispatchContext = useMemo(
    () => ({
      handleSignIn: async (user: MyUser) => {
        await Promise.all([
          AsyncStorage.setItem(persistKeys.myId, user.id),
          AsyncStorage.setItem(persistKeys.token, user.access_token),
          AsyncStorage.setItem(persistKeys.refreshToken, user.refresh_token),
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
          AsyncStorage.setItem(persistKeys.token, user.access_token),
          AsyncStorage.setItem(persistKeys.refreshToken, user.refresh_token),
        ]);
        dispatch({ type: "SIGN_IN", user });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={authDispatchContext}>
        <AppNavigation user={state.myProfile} />
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}
