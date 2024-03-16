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
import { CommentList } from '@screens/home/commetList';
import { ProfileRoute } from './profile-route';
import { EditPostOfferScreen } from '@screens/createEditPost/offerEdit';
import { EditPostRequestScreen } from '@screens/createEditPost/requestEdit';
import { EditPostGratisScreen } from '@screens/createEditPost/gratisEdit';

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
      {/* <HomeStack.Screen
        name={navigations.PROFILE}
        component={ProfileScreen}
        options={{header}}
      /> */}
      <HomeStack.Screen
        name={'profileroute'}
        component={ProfileRoute}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOST}
        component={CreatePostScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTOFFER}
        component={CreatePostOfferScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTREQUEST}
        component={CreatePostRequestScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.CREATEPOSTGRATIS}
        component={CreatePostGratisScreen}
        options={{header}}
      />
       <HomeStack.Screen
        name={navigations.RECENTUSERPROFILE}
        component={RecentProfileScreen}
        options={{header}}
      />
       <HomeStack.Screen
        name={navigations.COMMENTLIST}
        component={CommentList}
        options={{header}}
      />
        <HomeStack.Screen
        name={navigations.ADMIN_TOOLS}
        component={AdminToolsScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTOFFER}
        component={EditPostOfferScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTREQUEST}
        component={EditPostRequestScreen}
        options={{header}}
      />
      <HomeStack.Screen
        name={navigations.EDITPOSTGRATIS}
        component={EditPostGratisScreen}
        options={{header}}
      />
    </HomeStack.Navigator>
  );
};
