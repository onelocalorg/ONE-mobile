import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "~/screens/home";
import { navigations } from "./constant";
import { EventDetailScreen } from "~/screens/event-detail";
import { ProfileScreen } from "~/screens/profile";
import { AdminToolsScreen } from "~/screens/admin-tools";
import { CheckInScreen } from "~/screens/check-in";
import { PaymentScreen } from "~/screens/payment-screen";
import { CreatePostScreen } from "~/screens/createPost";
import { RecentProfileScreen } from "~/screens/recentProfile";
import { CreatePostGratisScreen } from "~/screens/createPost/gratis";
import { CreatePostRequestScreen } from "~/screens/createPost/request";
import { CreatePostOfferScreen } from "~/screens/createPost/offer";
import { CommentList } from "~/screens/home/commetList";
import { AddPayoutExpenseScreen } from "~/screens/admin-tools/addPayoutExpense-modal";
import { EditPayoutModalScreen } from "~/screens/admin-tools/editPayoutExpense-modal";

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
