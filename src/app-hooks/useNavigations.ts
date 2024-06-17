import { useNavigation } from "@react-navigation/native";
import _ from "lodash/fp";
import { Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export function useNavigations() {
  const navigation = useNavigation();

  const asId = (v: string | OneUser | Post | LocalEvent) =>
    _.isString(v) ? v : v.id;

  const gotoUserProfile = (user: string | OneUser) => () => {
    navigation.navigate(Screens.USER_PROFILE, {
      id: asId(user),
    });
  };

  const gotoPostDetails = (post: string | Post) => () => {
    navigation.navigate(Screens.POST_DETAIL, {
      id: asId(post),
    });
  };

  const gotoEventDetails = (event: string | LocalEvent) => () => {
    navigation.navigate(Screens.EVENT_DETAIL, {
      id: asId(event),
    });
  };

  const gotoPostContextMenu = (post: string | Post) => () => {
    navigation.navigate(Screens.POST_CONTEXT_MENU_MODAL, {
      id: asId(post),
    });
  };

  return {
    gotoUserProfile,
    gotoPostDetails,
    gotoEventDetails,
    gotoPostContextMenu,
  };
}
