import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistKeys } from "~/network/constant";
import { CurrentUser } from "~/types/current-user";

export const storeAuthDataInAsyncStorage = (user: CurrentUser) => {
  AsyncStorage.setItem(persistKeys.token, user.access_token);
  AsyncStorage.setItem(persistKeys.userProfileId, user.id);
  AsyncStorage.setItem(persistKeys.userProfilePic, user.pic);
};
