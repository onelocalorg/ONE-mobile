import { useAppTheme } from "~/app-hooks/use-app-theme";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainerRef,
  ParamListBase,
  RouteProp,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";
import { bottomTabs } from "~/assets/constants";
import {
  addGreen,
  calendarTime,
  eventTwo,
  home,
  notificationTwo,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { ModalRefProps } from "~/components/modal-component";
import { ChatScreen } from "~/screens/chat";
import { CreatePostModal } from "~/screens/createEditPost/create-post-modal";
import { bottomNavigationVisibleScreens, navigations } from "./constant";
import { EventRoute } from "./event-route";
import { HomeRoute } from "./home-route";
import { MapRoute } from "./map-route";
import { NavigatorOptionComponent } from "./navigator-option-component";
import { createStyleSheet } from "./style";

const Tab = createBottomTabNavigator();
const header = () => null;
const NullComponent = () => <></>;

export const BottomNavigator = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const navigation = useNavigation();

  const bottomNav = [bottomTabs.home, "event", bottomTabs.map, bottomTabs.chat];

  const getTabData = (name: string) => {
    switch (name) {
      case bottomTabs.home:
        return {
          screenName: navigations.HOME_ROUTE,
          component: HomeRoute,
        };
      case "event":
        return {
          screenName: navigations.EVENT_ROUTE,
          component: EventRoute,
        };
      case bottomTabs.map:
        return {
          screenName: navigations.MAP_ROUTE,
          component: MapRoute,
        };
      case bottomTabs.chat:
        return {
          screenName: navigations.CHAT,
          component: ChatScreen,
        };
      default:
        return {
          screenName: "",
          component: HomeRoute,
        };
    }
  };

  let tabs = bottomNav?.map((nav) => getTabData(nav)) || [];

  tabs.splice(2, 0, {
    screenName: bottomTabs.addButton,
    component: NullComponent,
  });

  const renderAddButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => modalRef.current?.onOpenModal()}
      >
        <ImageComponent source={addGreen} style={styles.addGreen} />
      </TouchableOpacity>
    );
  };

  const renderTabs = (
    route: RouteProp<ParamListBase, string>,
    focused: boolean
  ) => {
    if (route.name === navigations.HOME_ROUTE) {
      return (
        <NavigatorOptionComponent
          focused={focused}
          selectedImage={home}
          unSelectedImage={home}
        />
      );
    }
    if (route.name === navigations.EVENT_ROUTE) {
      return (
        <NavigatorOptionComponent
          focused={focused}
          selectedImage={calendarTime}
          unSelectedImage={calendarTime}
        />
      );
    }
    if (route.name === navigations.CHAT) {
      return (
        <NavigatorOptionComponent
          focused={focused}
          selectedImage={notificationTwo}
          unSelectedImage={notificationTwo}
        />
      );
    }
    if (route.name === navigations.MAP_ROUTE) {
      return (
        <NavigatorOptionComponent
          focused={focused}
          selectedImage={eventTwo}
          unSelectedImage={eventTwo}
        />
      );
    }
    return null;
  };

  const getTabbarStyle = (route: RouteProp<ParamListBase, string>) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (
      routeName.length === 0 ||
      (bottomNavigationVisibleScreens.includes(routeName) &&
        bottomNav.includes(routeName))
    ) {
      return [styles.container];
    }
    return [{ display: "none" }];
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => renderTabs(route, focused),
          tabBarShowLabel: false,
        })}
        initialRouteName={navigations.HOME_ROUTE}
        backBehavior="none"
      >
        {tabs.map((tab) => {
          if (tab?.screenName === bottomTabs.addButton) {
            return (
              <>
                <Tab.Screen
                  name={tab?.screenName}
                  key={tab?.screenName}
                  component={tab?.component}
                  options={({ route }): any => ({
                    tabBarButton: renderAddButton,
                    tabBarStyle: getTabbarStyle(route),
                    header,
                  })}
                />
              </>
            );
          }
          return (
            <>
              <Tab.Screen
                name={tab?.screenName}
                key={tab?.screenName}
                component={tab?.component}
                options={({ route }): any => ({
                  header,
                  tabBarStyle: getTabbarStyle(route),
                })}
              />
            </>
          );
        })}
      </Tab.Navigator>
      <CreatePostModal
        navigation={
          navigation as unknown as NavigationContainerRef<ParamListBase>
        }
        modalRef={modalRef}
      />
    </>
  );
};
