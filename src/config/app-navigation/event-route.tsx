import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CheckInScreen } from "~/screens/check-in";
import { CreateEditEventScreen } from "~/screens/createEditEvent/CreateEditEventScreen";
import { AddPayoutExpenseScreen } from "~/screens/createEditEvent/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/createEditEvent/editPayoutExpense-modal";
import { CreatePostScreen } from "~/screens/createEditPost/CreatePostScreen";
import { EditPostScreen } from "~/screens/createEditPost/EditPostScreen";
import { CreateEditPostGratisScreen } from "~/screens/createEditPost/gratis";
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
        component={CreateEditEventScreen}
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
        name={navigations.CREATE_POST}
        component={CreatePostScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.EDIT_POST}
        component={EditPostScreen}
        options={{ header }}
      />
      <EventStack.Screen
        name={navigations.CREATE_EDIT_POST_GRATIS}
        component={CreateEditPostGratisScreen}
        options={{ header }}
      />
    </EventStack.Navigator>
  );
};
