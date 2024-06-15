import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

export enum Screens {
  LOGIN = "Login",
  SIGNUP = "Signup",
  WEBVIEW = "WebView",
  MAIN_TABS = "MainTabs",
  HOME_SCREEN = "HomeScreen",
  POST_DETAIL = "PostDetail",
  EVENT_DETAIL = "EventDetail",
  CREATE_EDIT_EVENT = "CreateEditEvent",
  USER_PROFILE = "UserProfile",
  MY_PROFILE = "MyProfile",
  EVENTS_LIST = "EventsList",
  MAP = "Map",
  CREATE_POST = "CreatePost",
  EDIT_POST = "EditPost",

  HOME_STACK = "HomeStack",
  EVENTS_STACK = "EventsStack",
  MAP_STACK = "MapStack",

  POST_CONTEXT_MENU_MODAL = "PostContextMenu",
  GIVE_GRATS_MODAL = "GiveGrats",
  REPORT_CONTENT_MODAL = "ReportContent",
}

export type GuestStackParamList = {
  [Screens.LOGIN]: undefined;
  [Screens.SIGNUP]: undefined;
  [Screens.WEBVIEW]: { url: string };
};

export type GuestStackScreenProps<T extends keyof GuestStackParamList> =
  StackScreenProps<GuestStackParamList, T>;

export type RootStackParamList = {
  [Screens.MAIN_TABS]: NavigatorScreenParams<MainTabsParamList>;
  [Screens.USER_PROFILE]: { id: string };
  [Screens.MY_PROFILE]: undefined;
  [Screens.POST_CONTEXT_MENU_MODAL]: { id: string; isMine?: boolean };
  [Screens.GIVE_GRATS_MODAL]: { postId: string };
  [Screens.REPORT_CONTENT_MODAL]: { postId: string };
  [Screens.EVENT_DETAIL]: { id: string };
  [Screens.CREATE_EDIT_EVENT]: { id?: string };
  [Screens.POST_DETAIL]: { id: string };
  [Screens.CREATE_POST]: undefined;
  [Screens.EDIT_POST]: { id: string };
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

// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends RootStackParamList {}
//   }
// }
