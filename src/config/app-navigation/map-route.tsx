import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CreateEditEventScreen } from "~/screens/createEditEvent/CreateEditEventScreen";
import { CreatePostScreen } from "~/screens/createEditPost/CreatePostScreen";
import { CreateEditPostGratisScreen } from "~/screens/createEditPost/gratis";
import { CreateEditPostOfferScreen } from "~/screens/createEditPost/offer";
import { CreateEditPostRequestScreen } from "~/screens/createEditPost/request";
import { EventDetailScreen } from "~/screens/event-detail/EventDetailScreen";
import { MapScreen } from "~/screens/map/MapScreen";
import { ProfileScreen } from "~/screens/profile";
import { navigations } from "./constant";

const MapStack = createStackNavigator();

const header = () => null;

export const MapRoute = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name={navigations.MAP}
        component={MapScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={CreateEditEventScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.EDIT_POST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.EDIT_POST}
        component={CreateEditPostOfferScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.EDIT_POST}
        component={CreateEditPostRequestScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.CREATE_EDIT_POST_GRATIS}
        component={CreateEditPostGratisScreen}
        options={{ header }}
      />
    </MapStack.Navigator>
  );
};
