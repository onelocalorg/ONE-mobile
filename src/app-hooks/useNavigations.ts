import notifee, { EventType, Notification } from "@notifee/react-native";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash/fp";
import { useCallback, useEffect } from "react";
import { useNotificationService } from "~/navigation/NotificationService";
import { Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export function useNavigations() {
  const navigation = useNavigation();
  const { pullNotifications } = useNotificationService();

  const gotoPostDetails = useCallback(
    (post: string | Post, reply?: string, isReplyFocus?: boolean) => () => {
      navigation.navigate(Screens.POST_DETAIL, {
        id: asId(post),
        reply: reply,
        isReplyFocus,
      });
    },
    [navigation]
  );

  // Subscribe to events
  useEffect(() => {
    const handleNotificationPress = (notification: Notification) => {
      const data = notification?.data;
      if (data && !_.isEmpty(data)) {
        const post = data["post"] as string;
        const parent = data["parent"] as string;
        console.log("post", post);
        console.log("parent", parent);
        gotoPostDetails(post)();
      } else {
        const receivedNotifications = pullNotifications();
        console.log("navigatingTo", receivedNotifications);
        if (receivedNotifications.length > 0) {
          gotoPostDetails(receivedNotifications[0].post)();
        }
      }
    };

    return notifee.onForegroundEvent(({ type, detail }) => {
      const { notification } = detail;
      console.log("onForegroundEvent", notification);

      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", notification);
          break;
        case EventType.PRESS:
          console.log("User pressed notification", notification);
          if (notification) {
            handleNotificationPress(notification);
          }
          break;
        case EventType.DELIVERED:
          console.log("Received notification", notification);
          // Ignore notifications which are simply delivered
          break;
        default:
          console.log("Unknown action " + type, notification);
      }
      if (notification?.id) {
        // console.log("canceling notification");
        // notifee
        //   .cancelDisplayedNotification(notification.id)
        //   .catch((e) => LOG.error("Error canceling displayed notification", e));
        // notifee
        //   .cancelNotification(notification.id)
        //   .catch((e) => LOG.error("Error canceling notification", e));
      }
    });
  }, []);

  const asId = (v: string | OneUser | Post | LocalEvent) =>
    _.isString(v) ? v : v?.id;

  const gotoUserProfile = (user: string | OneUser) => () => {
    navigation.navigate(Screens.USER_PROFILE, {
      id: asId(user),
    });
  };

  const gotoEventDetails =
    (event: string | LocalEvent, reply?: string) => () => {
      navigation.navigate(Screens.EVENT_DETAIL, {
        id: asId(event),
        reply: reply,
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

  const gotoCreatePost = () => {
    navigation.navigate(Screens.CREATE_EDIT_POST);
  };

  return {
    gotoUserProfile,
    gotoPostDetails,
    gotoEventDetails,
    showPostContextMenu,
    showGiveGratisModal,
    gotoCreatePost,
  };
}
