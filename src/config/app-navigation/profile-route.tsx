import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AdminToolsScreen } from "~/screens/admin-tools";
import { AddPayoutExpenseScreen } from "~/screens/admin-tools/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/admin-tools/editPayoutExpense-modal";
import { CheckInScreen } from "~/screens/check-in";
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
        component={AdminToolsScreen}
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
