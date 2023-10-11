import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';

export let navigatorRef: NavigationContainerRef<ReactNavigation.RootParamList> | null;

export const setNavigator = (
  nav: NavigationContainerRef<ReactNavigation.RootParamList> | null,
) => {
  navigatorRef = nav;
};

export const getNavigator = () =>
  navigatorRef as NavigationContainerRef<ParamListBase>;
