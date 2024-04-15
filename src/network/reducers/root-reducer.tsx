import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnyAction, combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { internetConnectionHandleReducer } from "./internet-connection-handle-reducer";
import { userProfileReducer } from "./user-profile-reducer";
import { logoutReducer } from "./logout-reducer";

const combinedReducer = combineReducers({
  internetConnectionHandleReducer,
  userProfileReducer,
  logoutReducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer = (state: RootState, action: AnyAction) => {
  let stateData = state;
  if (action.type === "logout/clearReducer") {
    stateData = {} as RootState;
  }

  return combinedReducer(stateData, action);
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userProfileReducer"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
