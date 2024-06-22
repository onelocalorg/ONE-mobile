import notifee, { AuthorizationStatus, EventType } from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { UserMutations } from "~/network/api/services/useUserService";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { useMyUserId } from "./AuthContext";

// import RemoteMessage from "@react-native-firebase/messaging"

interface INotificationService {}

const NotificationServiceContext = createContext<INotificationService | null>(
  null
);

export function useNotificationService() {
  return useContext(NotificationServiceContext) as INotificationService;
}

interface NotificationServiceProviderProps {
  children: ReactNode;
}
export function NotificationService({
  children,
}: NotificationServiceProviderProps) {
  const myUserId = useMyUserId();

  const { mutate: updateUser } = useMutation<
    UserProfile,
    Error,
    UserProfileUpdateData
  >({
    mutationKey: [UserMutations.updateUser],
  });

  // Note that an async function or a function that returns a Promise
  // is required for both subscribers.
  async function onMessageReceived({
    notification,
  }: FirebaseMessagingTypes.RemoteMessage) {
    console.log("onMessageReceived", notification);
    if (notification) {
      await notifee
        .displayNotification({
          title: notification.title ?? "No title",
          body: notification.body ?? "No body",
        })
        .catch((e) => handleApiError("Displaying notification", e as Error));
    }
  }

  useEffect(() => {
    async function registerMessagingToken() {
      const settings = await notifee.requestPermission();

      // TODO Handle various conditions
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        const messagingToken = await messaging().getToken();
        console.log("MESSAGING", messagingToken);
        updateUser({ id: myUserId!, messagingToken });
      } else {
        console.log("User declined permissions");
      }
    }

    if (myUserId) {
      registerMessagingToken().catch((e) =>
        handleApiError("registering messaging", e as Error)
      );

      messaging().onMessage(onMessageReceived);
      messaging().setBackgroundMessageHandler(onMessageReceived);
    }
  }, [myUserId, updateUser]);

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      console.log("onForegroundEvent", type);
      const { notification } = detail;
      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", notification);
          break;
        case EventType.PRESS:
          console.log("User pressed notification", notification);
          break;
      }
    });
  }, []);

  const client = {};

  return (
    <NotificationServiceContext.Provider value={client}>
      {children}
    </NotificationServiceContext.Provider>
  );
}
