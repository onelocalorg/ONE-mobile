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
import { GratitudeScreen } from '@screens/gratitude';

const MapStack = createStackNavigator();

const header = () => null;

export const MapRoute = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name={navigations.GRATITUDE}
        component={GratitudeScreen}
        options={{header}}
      />
      <MapStack.Screen
        name={navigations.EVENT_DETAIL}
        component={EventDetailScreen}
        options={{header}}
      />
      <MapStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{header}}
      />
      <MapStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={AdminToolsScreen}
        options={{header}}
      />
    </MapStack.Navigator>
  );
};
