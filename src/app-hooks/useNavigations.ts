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

  const gotoPostDetails =
    (post: string | Post, isReplyFocus?: boolean) => () => {
      navigation.navigate(Screens.POST_DETAIL, {
        id: asId(post),
        isReplyFocus,
      });
    };

  const gotoEventDetails = (event: string | LocalEvent) => () => {
    navigation.navigate(Screens.EVENT_DETAIL, {
      id: asId(event),
    });
  };

  const showPostContextMenu = (post: string | Post, author: string) => () => {
    navigation.navigate(Screens.POST_CONTEXT_MENU_MODAL, {
      postId: asId(post),
      authorId: author,
    });
  };

  interface GiveGratisProps {
    post: string | Post;
    commentId?: string;
    replyId?: string;
  }
  const showGiveGratisModal =
    ({ post, commentId, replyId }: GiveGratisProps) =>
    () => {
      navigation.navigate(Screens.GIVE_GRATIS_MODAL, {
        postId: asId(post),
        commentId,
        replyId,
      });
    };

  return {
    gotoUserProfile,
    gotoPostDetails,
    gotoEventDetails,
    showPostContextMenu,
    showGiveGratisModal,
  };
}
