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
import { CreatePostGratisScreen } from '@screens/createPost/gratis';
import { CreatePostRequestScreen } from '@screens/createPost/request';
import { CreatePostOfferScreen } from '@screens/createPost/offer';
import { EventList } from '@components/event-list';
import { EventListScreen } from '@screens/event';

const EventStack = createStackNavigator();

const header = () => null;

export const EventRoute = () => {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name={navigations.EVENTSCREEN}
        component={EventListScreen}
        options={{header}}
      />
      <EventStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{header}}
      />
      <EventStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{header}}
      />
      <EventStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={AdminToolsScreen}
        options={{header}}
      />
      <EventStack.Screen
        name={navigations.CHECK_IN}
        component={CheckInScreen}
        options={{header}}
      />
      <EventStack.Screen
        name={navigations.PAYMENT}
        component={PaymentScreen}
        options={{header}}
      />
       <EventStack.Screen
        name={navigations.RECENTUSERPROFILE}
        component={RecentProfileScreen}
        options={{header}}
      />
    </EventStack.Navigator>
  );
};
