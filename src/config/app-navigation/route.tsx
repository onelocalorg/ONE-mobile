import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {navigations} from './constant';
import {setNavigator} from './root-navigation';
import {LoginScreen} from '@screens/login';
import {BottomNavigator} from './bottom-navigator';
import {useToken} from '@app-hooks/use-token';
import {Loader} from '@components/loader';
import {GenericWebView} from '@components/generic-webview';
import { SignUp } from '@screens/signUp';

export interface RefObj {
  onShowToast: (msg?: string, type?: 'success' | 'error' | 'pending') => void;
}

export interface RouteProps {
  route?: {
    params: object;
  };
}

const RouteStack = createStackNavigator();

const header = () => null;

export const Route = (props: RouteProps) => {
  const {token, loading} = useToken();
  let initialScreen = navigations.LOGIN;

  if (loading) {
    return <Loader visible={loading} />;
  }

  if (token) {
    initialScreen = navigations.BOTTOM_NAVIGATION;
  }

  return (
    <>
      <NavigationContainer
        ref={(_: NavigationContainerRef<ReactNavigation.RootParamList>) => {
          setNavigator(_);
        }}>
        <RouteStack.Navigator initialRouteName={initialScreen}>
          <RouteStack.Screen
            name={navigations.LOGIN}
            component={LoginScreen}
            options={{header}}
            initialParams={props}
          />
          <RouteStack.Screen
            name={navigations.SIGNUP}
            component={SignUp}
            options={{header}}
            initialParams={props}
          />
          <RouteStack.Screen
            name={navigations.BOTTOM_NAVIGATION}
            component={BottomNavigator}
            options={{header}}
          />
          <RouteStack.Screen
            name={navigations.GENERIC_WEB_VIEW}
            component={GenericWebView}
            options={{header}}
          />
        </RouteStack.Navigator>
      </NavigationContainer>
    </>
  );
};
