import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  StackNavigationOptions,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { ShortModalScreenOptions } from "~/components/ShortModal";
import { ChapterListSearchable } from "~/components/chapter-list-searchable/ChapterListSearchable";
import { GenericWebView } from "~/components/generic-webview";
import { MyAvatar } from "~/components/navbar/MyAvatar";
import { OneLogo } from "~/components/navbar/OneLogo";
import { UserListSearchable } from "~/components/user-list-searchable/UserListSearchable";
import { AddEditPaymentScreen } from "~/screens/createEditEvent/AddEditPaymentScreen";
import { CreateEventScreen } from "~/screens/createEditEvent/CreateEventScreen";
import { EditEventScreen } from "~/screens/createEditEvent/EditEventScreen";
import { EventAdministrationScreen } from "~/screens/createEditEvent/EventAdministrationScreen";
import { CreateGroupScreen } from "~/screens/createEditGroup/CreateGroupScreen";
import { EditGroupScreen } from "~/screens/createEditGroup/EditGroupScreen";
import { CreatePostScreen } from "~/screens/createEditPost/CreatePostScreen";
import { EditPostScreen } from "~/screens/createEditPost/EditPostScreen";
import { ChooseTicketsModal } from "~/screens/event-detail/ChooseTicketsModal";
import { EventDetailScreen } from "~/screens/event-detail/EventDetailScreen";
import { EventListScreen } from "~/screens/event/EventListScreen";
import { GroupDetailScreen } from "~/screens/group-detail/GroupDetailScreen";
import { GiveGratis } from "~/screens/home/GiveGratis";
import { HomeScreen } from "~/screens/home/HomeScreen";
import { PostContextMenu } from "~/screens/home/PostContextMenu";
import { PostDetailScreen } from "~/screens/home/PostDetailScreen";
import { ReportContent } from "~/screens/home/ReportContent";
import { LoginScreen } from "~/screens/login/LoginScreen";
import { SignUpScreen } from "~/screens/login/SignupScreen";
import { VerifyScreen } from "~/screens/login/VerifyScreen";
import { MapScreen } from "~/screens/map/MapScreen";
import { LogoutPressable } from "~/screens/myprofile/LogoutPressable";
import { MyProfileScreen } from "~/screens/myprofile/MyProfileScreen";
import { UserProfileScreen } from "~/screens/userProfile/UserProfileScreen";
import { EventIcon, HomeIcon, MapIcon, TabIcon } from "./TabIcon";
import {
  EventsStackParamList,
  GuestStackParamList,
  HomeStackParamList,
  MainTabsParamList,
  MapStackParamList,
  RootStackParamList,
  Screens,
} from "./types";

type AppNavigationProps = {
  email?: string;
  password?: string;
  token?: string;
};

export const AppNavigation = ({
  email,
  password,
  token,
}: AppNavigationProps) => {
  const { theme } = useAppTheme();

  const linking = {
    prefixes: ["onelocal://", "https://app.onelocal.one"],
    config: {
      screens: {
        [Screens.HOME_SCREEN]: {
          path: "home",
        },
        [Screens.CREATE_POST]: {
          path: "posts/create",
        },
        [Screens.EDIT_POST]: {
          path: "posts/edit",
        },
        [Screens.CREATE_GROUP]: {
          path: "groups/create",
        },
        [Screens.EDIT_GROUP]: {
          path: "groups/edit",
        },
        [Screens.POST_DETAIL]: {
          path: "posts/:id/:reply?",
        },
        [Screens.EVENT_DETAIL]: {
          path: "events/:id/:reply",
        },
        [Screens.MY_PROFILE]: {
          path: "users/me",
        },
        [Screens.MAP]: {
          path: "map",
        },
      },
    },
  };

  const MainTabs = createBottomTabNavigator<MainTabsParamList>();
  const MainTabsScreen = () => (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: theme.colors.footerColor },
        tabBarActiveTintColor: "#c5e0d8",
        tabBarInactiveTintColor: theme.colors.gray,
      }}
    >
      <MainTabs.Screen
        name={Screens.HOME_STACK}
        component={HomeStackScreen}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} image={HomeIcon} />,
        }}
      />
      <MainTabs.Screen
        name={Screens.EVENTS_STACK}
        component={EventsStackScreen}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} image={EventIcon} />,
        }}
      />
      <MainTabs.Screen
        name={Screens.MAP_STACK}
        component={MapStackScreen}
        options={{
          tabBarIcon: (props) => <TabIcon {...props} image={MapIcon} />,
        }}
      />
      {/* <Tab.Screen name="ChatStack" component={ChatStackScreen} /> */}
    </MainTabs.Navigator>
  );

  const HomeStack = createStackNavigator<HomeStackParamList>();
  const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={Screens.HOME_SCREEN} component={HomeScreen} />
    </HomeStack.Navigator>
  );

  const EventsStack = createStackNavigator<EventsStackParamList>();
  const EventsStackScreen = () => (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen
        name={Screens.EVENTS_LIST}
        component={EventListScreen}
      />
    </EventsStack.Navigator>
  );

  const MapStack = createStackNavigator<MapStackParamList>();
  const MapStackScreen = () => (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name={Screens.MAP} component={MapScreen} />
    </MapStack.Navigator>
  );

  const RootStack = createStackNavigator<RootStackParamList>();
  const GuestStack = createStackNavigator<GuestStackParamList>();

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator
        screenOptions={({ navigation, route }): StackNavigationOptions => ({
          headerTitle: () => <OneLogo />,
          headerStyle: {
            backgroundColor: theme.colors.headerColor,
            height: 120,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
            marginBottom: 20,
          },
          headerLeftLabelVisible: false,
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerTintColor: theme.colors.white,
          headerRight: () =>
            route.name === Screens.MY_PROFILE ? (
              <LogoutPressable />
            ) : token ? (
              <MyAvatar
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
                onPress={() => navigation.navigate(Screens.MY_PROFILE)}
              />
            ) : null,
        })}
      >
        {token ? (
          <RootStack.Group>
            <RootStack.Screen
              name={Screens.MAIN_TABS}
              component={MainTabsScreen}
            />
            <RootStack.Screen
              name={Screens.MY_PROFILE}
              component={MyProfileScreen}
            />
            <RootStack.Screen
              name={Screens.USER_PROFILE}
              component={UserProfileScreen}
            />
            <RootStack.Screen
              name={Screens.POST_DETAIL}
              component={PostDetailScreen}
            />
            <RootStack.Screen
              name={Screens.EVENT_DETAIL}
              component={EventDetailScreen}
            />
            <RootStack.Screen
              name={Screens.GROUP_DETAIL}
              component={GroupDetailScreen}
            />
            <RootStack.Screen
              name={Screens.CREATE_EVENT}
              component={CreateEventScreen}
            />
            <RootStack.Screen
              name={Screens.EDIT_EVENT}
              component={EditEventScreen}
            />
            <RootStack.Screen
              name={Screens.CREATE_POST}
              component={CreatePostScreen}
            />
            <RootStack.Screen
              name={Screens.EDIT_POST}
              component={EditPostScreen}
            />
            <RootStack.Screen
              name={Screens.CREATE_GROUP}
              component={CreateGroupScreen}
            />
            <RootStack.Screen
              name={Screens.EDIT_GROUP}
              component={EditGroupScreen}
            />
            <RootStack.Screen
              name={Screens.SELECT_USERS}
              component={UserListSearchable}
            />
            <RootStack.Screen
              name={Screens.SELECT_CHAPTERS}
              component={ChapterListSearchable}
            />
            <RootStack.Screen
              name={Screens.EVENT_ADMINISTRATION}
              component={EventAdministrationScreen}
            />
          </RootStack.Group>
        ) : email ? (
          <GuestStack.Screen
            name={Screens.VERIFY}
            component={VerifyScreen}
            initialParams={{ email, password }}
          />
        ) : (
          <GuestStack.Group>
            <GuestStack.Screen name={Screens.LOGIN} component={LoginScreen} />
            <GuestStack.Screen name={Screens.SIGNUP} component={SignUpScreen} />
            <GuestStack.Screen
              name={Screens.WEBVIEW}
              component={GenericWebView}
            />
          </GuestStack.Group>
        )}
        <RootStack.Group
          screenOptions={{
            presentation: "modal",
            headerShown: false,
          }}
        >
          <RootStack.Screen
            name={Screens.POST_CONTEXT_MENU_MODAL}
            component={PostContextMenu}
            options={{
              ...ShortModalScreenOptions,
            }}
          />
          <RootStack.Screen
            name={Screens.GIVE_GRATIS_MODAL}
            component={GiveGratis}
            options={{
              ...ShortModalScreenOptions,
            }}
          />
          <RootStack.Screen
            name={Screens.REPORT_CONTENT_MODAL}
            component={ReportContent}
            options={{
              ...ShortModalScreenOptions,
            }}
          />
          <RootStack.Screen
            name={Screens.CHOOSE_TICKETS}
            component={ChooseTicketsModal}
            options={{
              ...ShortModalScreenOptions,
            }}
          />
          <RootStack.Screen
            name={Screens.ADD_EDIT_PAYMENT}
            component={AddEditPaymentScreen}
            options={{
              ...ShortModalScreenOptions,
            }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
