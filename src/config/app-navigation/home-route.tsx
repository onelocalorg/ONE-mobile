import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CreateEditEventScreen } from "~/screens/createEditEvent/CreateEditEventScreen";
import { CreatePostScreen } from "~/screens/createEditPost";
import { CreateEditPostGratisScreen } from "~/screens/createEditPost/gratis";
import { CreateEditPostOfferScreen } from "~/screens/createEditPost/offer";
import { CreateEditPostRequestScreen } from "~/screens/createEditPost/request";
import { HomeScreen } from "~/screens/home";
import { CommentList } from "~/screens/home/commetList";
import { ProfileScreen } from "~/screens/profile";
import { RecentProfileScreen } from "~/screens/recentProfile";
import { navigations } from "./constant";
import { ProfileRoute } from "./profile-route";

const HomeStack = createStackNavigator();

const header = () => null;

export const HomeRoute = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={navigations.HOMESCREEN}
        component={HomeScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={"profileroute"}
        component={ProfileRoute}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATE_EDIT_POST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATE_EDIT_POST_OFFER}
        component={CreateEditPostOfferScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATE_EDIT_POST_REQUEST}
        component={CreateEditPostRequestScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATE_EDIT_POST_GRATIS}
        component={CreateEditPostGratisScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.RECENTUSERPROFILE}
        component={RecentProfileScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.COMMENTLIST}
        component={CommentList}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={CreateEditEventScreen}
        options={{ header }}
      />
    </HomeStack.Navigator>
  );
};
