import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { ChapterData } from "~/types/chapter";
import { OneUserData } from "~/types/one-user";
import { PaymentType } from "~/types/payment";

export enum Screens {
  LOGIN = "Login",
  SIGNUP = "Signup",
  VERIFY = "Verify",
  WEBVIEW = "WebView",
  MAIN_TABS = "MainTabs",
  HOME_SCREEN = "HomeScreen",
  POST_DETAIL = "PostDetail",
  EVENT_DETAIL = "EventDetail",
  GROUP_DETAIL = "GroupDetail",
  USER_PROFILE = "UserProfile",
  MY_PROFILE = "MyProfile",
  EVENTS_LIST = "EventsList",
  MAP = "Map",

  HOME_STACK = "HomeStack",
  EVENTS_STACK = "EventsStack",
  MAP_STACK = "MapStack",

  POST_CONTEXT_MENU_MODAL = "PostContextMenu",
  GIVE_GRATIS_MODAL = "GiveGratis",
  REPORT_CONTENT_MODAL = "ReportContent",
  CREATE_EVENT = "CreateEvent",
  EDIT_EVENT = "EditEvent",
  CREATE_POST = "CreatePost",
  EDIT_POST = "EditPost",
  CREATE_GROUP = "CreateGroup",
  EDIT_GROUP = "EditGroup",
  SELECT_USERS = "SelectUsers",
  SELECT_CHAPTERS = "SelectChapters",
  EVENT_ADMINISTRATION = "EventAdministration",
  ADD_EDIT_PAYMENT = "AddEditPayment",
}

export type GuestStackParamList = {
  [Screens.LOGIN]: undefined;
  [Screens.SIGNUP]: undefined;
  [Screens.VERIFY]: { email: string; password?: string; token?: string };
  [Screens.WEBVIEW]: { url: string };
};

export type GuestStackScreenProps<T extends keyof GuestStackParamList> =
  StackScreenProps<GuestStackParamList, T>;

export type RootStackParamList = {
  [Screens.MAIN_TABS]: NavigatorScreenParams<MainTabsParamList>;
  [Screens.USER_PROFILE]: { id: string };
  [Screens.MY_PROFILE]: undefined;
  [Screens.EVENT_DETAIL]: { id: string; reply?: string };
  [Screens.CREATE_EVENT]: { groupId?: string } | undefined;
  [Screens.EDIT_EVENT]: { id: string };
  [Screens.CREATE_POST]: { groupId?: string } | undefined;
  [Screens.EDIT_POST]: { id: string };
  [Screens.CREATE_GROUP]: { parentId?: string } | undefined;
  [Screens.EDIT_GROUP]: { id: string };
  [Screens.POST_DETAIL]: { id: string; reply?: string; isReplyFocus?: boolean };
  [Screens.POST_CONTEXT_MENU_MODAL]: {
    postId: string;
    authorId: string;
  };
  [Screens.GROUP_DETAIL]: { id: string };
  [Screens.GIVE_GRATIS_MODAL]: {
    postId: string;
    commentId?: string;
    replyId?: string;
  };
  [Screens.REPORT_CONTENT_MODAL]: { postId: string };
  [Screens.SELECT_USERS]: {
    type: string;
    users: OneUserData[];
  };
  [Screens.SELECT_CHAPTERS]: {
    chapters: ChapterData[];
  };
  [Screens.EVENT_ADMINISTRATION]: { eventId: string };
  [Screens.ADD_EDIT_PAYMENT]: {
    eventId: string;
    paymentId?: string;
    type?: PaymentType;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type MainTabsParamList = {
  [Screens.HOME_STACK]: NavigatorScreenParams<HomeStackParamList>;
  [Screens.EVENTS_STACK]: NavigatorScreenParams<EventsStackParamList>;
  [Screens.MAP_STACK]: NavigatorScreenParams<MapStackParamList>;
};

export type MainTabsScreenProps<T extends keyof MainTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackParamList = {
  [Screens.HOME_SCREEN]: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type EventsStackParamList = {
  [Screens.EVENTS_LIST]: undefined;
};

export type EventsStackScreenProps<T extends keyof EventsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<EventsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MapStackParamList = {
  [Screens.MAP]: undefined;
};

export type MapStackScreenProps<T extends keyof MapStackParamList> =
  CompositeScreenProps<
    StackScreenProps<MapStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
