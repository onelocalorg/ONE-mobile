import { useNavigation } from "@react-navigation/native";
import _ from "lodash/fp";
import { Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export function useNavigations() {
  const navigation = useNavigation();

  const gotoUserProfile = (user: string | OneUser) => {
    navigation.navigate(Screens.USER_PROFILE, {
      id: _.isString(user) ? user : user.id,
    });
  };

  const gotoPostDetails = (post: string | Post) => {
    navigation.navigate(Screens.POST_DETAIL, {
      id: _.isString(post) ? post : post.id,
    });
  };

  const gotoEventDetails = (event: string | LocalEvent) => {
    navigation.navigate(Screens.EVENT_DETAIL, {
      id: _.isString(event) ? event : event.id,
    });
  };

  return {
    gotoUserProfile,
    gotoPostDetails,
    gotoEventDetails,
  };
}
