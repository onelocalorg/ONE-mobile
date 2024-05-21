import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CreateEventScreen } from "~/screens/createEditEvent/CreateEventScreen";
import { CreatePostScreen } from "~/screens/createPost";
import { CreatePostGratisScreen } from "~/screens/createPost/gratis";
import { CreatePostOfferScreen } from "~/screens/createPost/offer";
import { CreatePostRequestScreen } from "~/screens/createPost/request";
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
        component={CreateEventScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.CREATEPOST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.CREATEPOSTOFFER}
        component={CreatePostOfferScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.CREATEPOSTREQUEST}
        component={CreatePostRequestScreen}
        options={{ header }}
      />
      <MapStack.Screen
        name={navigations.CREATEPOSTGRATIS}
        component={CreatePostGratisScreen}
        options={{ header }}
      />
    </MapStack.Navigator>
  );
};
