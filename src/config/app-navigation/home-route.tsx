import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CreateEventScreen } from "~/screens/createEditEvent/CreateEventScreen";
import { CreatePostScreen } from "~/screens/createPost";
import { CreatePostGratisScreen } from "~/screens/createPost/gratis";
import { CreatePostOfferScreen } from "~/screens/createPost/offer";
import { CreatePostRequestScreen } from "~/screens/createPost/request";
import { EditPostGratisScreen } from "~/screens/editPost/gratisEdit";
import { EditPostOfferScreen } from "~/screens/editPost/offerEdit";
import { EditPostRequestScreen } from "~/screens/editPost/requestEdit";
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
        name={navigations.CREATEPOST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTOFFER}
        component={CreatePostOfferScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTREQUEST}
        component={CreatePostRequestScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTGRATIS}
        component={CreatePostGratisScreen}
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
        component={CreateEventScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTOFFER}
        component={EditPostOfferScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTREQUEST}
        component={EditPostRequestScreen}
        options={{ header }}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTGRATIS}
        component={EditPostGratisScreen}
        options={{ header }}
      />
    </HomeStack.Navigator>
  );
};
