import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  StackNavigationOptions,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { ShortModalScreenOptions } from "~/components/ShortModal";
import { GenericWebView } from "~/components/generic-webview";
import { MyAvatar } from "~/components/navbar/MyAvatar";
import { OneLogo } from "~/components/navbar/OneLogo";
import { CreateEditEventScreen } from "~/screens/createEditEvent/CreateEditEventScreen";
import { CreateEditPostScreen } from "~/screens/createEditPost/CreateEditPostScreen";
import { EventDetailScreen } from "~/screens/event-detail/EventDetailScreen";
import { EventListScreen } from "~/screens/event/EventListScreen";
import { GiveGratis } from "~/screens/home/GiveGratis";
import { HomeScreen } from "~/screens/home/HomeScreen";
import { PostContextMenu } from "~/screens/home/PostContextMenu";
import { PostDetailScreen } from "~/screens/home/PostDetailScreen";
import { ReportContent } from "~/screens/home/ReportContent";
import { LoginScreen } from "~/screens/login/LoginScreen";
import { SignUp } from "~/screens/login/SignupScreen";
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
  token: string | null;
};
export const AppNavigation = ({ token }: AppNavigationProps) => {
  const { theme } = useAppTheme();

  const isLoggedIn = !!token;
  console.log("isLoggedIn", isLoggedIn);

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
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={({ navigation, route }): StackNavigationOptions => ({
          headerTitle: () => <OneLogo localText="B o u l d e r" />,
          headerStyle: {
            backgroundColor: theme.colors.headerColor,
            height: 120,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
            marginBottom: 20,
          },
          headerRight: () =>
            route.name === Screens.MY_PROFILE ? (
              <LogoutPressable />
            ) : isLoggedIn ? (
              <MyAvatar
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
                onPress={() => navigation.navigate(Screens.MY_PROFILE)}
              />
            ) : null,
        })}
      >
        {isLoggedIn ? (
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
          </RootStack.Group>
        ) : (
          <GuestStack.Group>
            <GuestStack.Screen name={Screens.LOGIN} component={LoginScreen} />
            <GuestStack.Screen name={Screens.SIGNUP} component={SignUp} />
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
            name={Screens.CREATE_EDIT_EVENT}
            component={CreateEditEventScreen}
          />
          <RootStack.Screen
            name={Screens.CREATE_EDIT_POST}
            component={CreateEditPostScreen}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
