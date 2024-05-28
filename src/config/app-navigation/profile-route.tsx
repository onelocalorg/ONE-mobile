import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CheckInScreen } from "~/screens/check-in";
import { CreateEditEventScreen } from "~/screens/createEditEvent/CreateEditEventScreen";
import { AddPayoutExpenseScreen } from "~/screens/createEditEvent/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/createEditEvent/editPayoutExpense-modal";
import { EventDetailScreen } from "~/screens/event-detail/EventDetailScreen";
import { ProfileScreen } from "~/screens/profile";
import { navigations } from "./constant";

const ProfileStack = createStackNavigator();

const header = () => null;

export const ProfileRoute = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={CreateEditEventScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.CHECK_IN}
        component={CheckInScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.ADDPAYOUTEXPENSE}
        component={AddPayoutExpenseScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.EDITPAYOUTEXPENSE}
        component={EditPayoutModalScreen}
        options={{ header }}
      />
    </ProfileStack.Navigator>
  );
};
