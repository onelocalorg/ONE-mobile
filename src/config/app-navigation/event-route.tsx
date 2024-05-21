import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CheckInScreen } from "~/screens/check-in";
import { CreateEventScreen } from "~/screens/createEditEvent/CreateEventScreen";
import { AddPayoutExpenseScreen } from "~/screens/createEditEvent/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/createEditEvent/editPayoutExpense-modal";
import { CreatePostScreen } from "~/screens/createPost";
import { CreatePostGratisScreen } from "~/screens/createPost/gratis";
import { CreatePostOfferScreen } from "~/screens/createPost/offer";
import { CreatePostRequestScreen } from "~/screens/createPost/request";
import { EventDetailScreen } from "~/screens/event-detail/EventDetailScreen";
import { EventListScreen } from "~/screens/event/EventListScreen";
import { PaymentScreen } from "~/screens/payment-screen";
import { ProfileScreen } from "~/screens/profile";
import { RecentProfileScreen } from "~/screens/recentProfile";
import { navigations } from "./constant";

const EventStack = createStackNavigator();

const header = () => null;

export const EventRoute = () => {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name={navigations.EVENTSCREEN}
        component={EventListScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={CreateEventScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CHECK_IN}
        component={CheckInScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.PAYMENT}
        component={PaymentScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.RECENTUSERPROFILE}
        component={RecentProfileScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.ADDPAYOUTEXPENSE}
        component={AddPayoutExpenseScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.EDITPAYOUTEXPENSE}
        component={EditPayoutModalScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CREATEPOST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CREATEPOSTOFFER}
        component={CreatePostOfferScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CREATEPOSTREQUEST}
        component={CreatePostRequestScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CREATEPOSTGRATIS}
        component={CreatePostGratisScreen}
        options={{ header }}
      />
    </EventStack.Navigator>
  );
};
