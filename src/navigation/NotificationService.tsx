import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useMutation } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDeviceId } from "react-native-device-info";
import { error } from "~/config";
import { UserMutations } from "~/network/api/services/useUserService";
import { RegisterTokenData, Token, TokenType } from "~/types/token";
import { handleApiError } from "~/utils/common";
import { useMyUserId } from "./AuthContext";

interface OneNotification {
  // image?: string;
  post: string;
  parent?: string;
  reply: string;
}

interface INotificationService {
  pullNotifications: () => OneNotification[];
}

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
  enum Channel {
    Replies = "replies",
  }
  const myUserId = useMyUserId();
  const [notifications, setNotifications] = useState<OneNotification[]>([]);

  const { mutate: registerToken } = useMutation<
    Token,
    Error,
    RegisterTokenData
  >({
    mutationKey: [UserMutations.registerToken],
  });

  useEffect(() => {
    notifee
      .createChannel({
        id: Channel.Replies,
        name: "Post replies",
        lights: false,
        vibration: false,
        importance: AndroidImportance.DEFAULT,
      })
      .catch(error("notifee.createChannel"));
  }, [Channel]);

  async function onMessageReceived({
    data,
    notification,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FirebaseMessagingTypes.RemoteMessage): Promise<any> {
    console.log("1. onMessageReceived", notification, data);

    return Promise.resolve(() => {
      if (data) {
        // This doesn't do anything yet
        setNotifications((notifications) => [
          ...notifications,
          {
            post: data["post"] as string,
            parent: data["parent"] as string | undefined,
            reply: data["reply"] as string,
          },
        ]);
      }
    });
  }

  useEffect(() => {
    async function registerMessagingToken() {
      const settings = await notifee.requestPermission();

      // TODO Handle various conditions
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        const messagingToken = await messaging().getToken();
        registerToken({
          userId: myUserId!,
          type: TokenType.fcm,
          token: messagingToken,
          deviceId: getDeviceId(),
        });
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
  }, [myUserId, registerToken]);

  const pullNotifications = () => {
    const currentNotifications = notifications;
    setNotifications([]);
    return currentNotifications;
  };

  const client = { pullNotifications };

  return (
    <NotificationServiceContext.Provider value={client}>
      {children}
    </NotificationServiceContext.Provider>
  );
}
