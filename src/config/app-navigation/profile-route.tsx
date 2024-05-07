import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CheckInScreen } from "~/screens/check-in";
import { CreateEventScreen } from "~/screens/createEvent/CreateEventScreen";
import { AddPayoutExpenseScreen } from "~/screens/createEvent/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/createEvent/editPayoutExpense-modal";
import { EventDetailScreen } from "~/screens/event-detail";
import { PaymentScreen } from "~/screens/payment-screen";
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
        component={CreateEventScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.CHECK_IN}
        component={CheckInScreen}
        options={{ header }}
      />
      <ProfileStack.Screen
        name={navigations.PAYMENT}
        component={PaymentScreen}
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
