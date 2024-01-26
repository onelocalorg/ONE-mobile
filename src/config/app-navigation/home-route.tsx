import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '@screens/home';
import {navigations} from './constant';
import {EventDetailScreen} from '@screens/event-detail';
import {ProfileScreen} from '@screens/profile';
import {AdminToolsScreen} from '@screens/admin-tools';
import {CheckInScreen} from '@screens/check-in';
import {PaymentScreen} from '@screens/payment-screen';
import { CreatePostScreen } from '@screens/createPost';
import { RecentProfileScreen } from '@screens/recentProfile';

const HomeStack = createStackNavigator();

const header = () => null;

export const HomeRoute = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={navigations.HOMESCREEN}
        component={HomeScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={AdminToolsScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CHECK_IN}
        component={CheckInScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.PAYMENT}
        component={PaymentScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOST}
        component={CreatePostScreen}
        options={{header}}
      />
       <HomeStack.Screen
        name={navigations.RECENTUSERPROFILE}
        component={RecentProfileScreen}
        options={{header}}
      />
    </HomeStack.Navigator>
  );
};
