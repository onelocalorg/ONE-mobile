import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {animationDuration} from '@assets/constants';
import {getNavigator} from '@config/app-navigation/root-navigation';
import {API} from '@network/api';
import {persistKeys} from '@network/constant';
import {clearReducer} from '@network/reducers/logout-reducer';
import {store} from '@network/reducers/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainerRef} from '@react-navigation/native';
import axios from 'axios';
import {Alert} from 'react-native';
import {queryClient} from '../app';
import {navigations} from '@config/app-navigation/constant';

export const logoutUser = async (navigation: NavigationContainerRef<any>) => {
  navigation.reset({index: 0, routes: [{name: navigations.LOGIN}]});

  store.dispatch(clearReducer());
  await AsyncStorage.multiRemove([persistKeys.token, persistKeys.fcmToken]);
  setTimeout(() => {
    queryClient.getQueryCache().clear();
  }, animationDuration.D2000);

  axios.defaults.headers.common.Authorization = '';
  API.initService();
};

export const useLogout = () => {
  const {strings} = useStringsAndLabels();
  const navigationRef = getNavigator();

  const onLogout = () => {
    Alert.alert(
      strings.logout,
      strings.areYouLogout,
      [
        {text: strings.no, onPress: () => null, style: 'cancel'},
        {
          text: strings.yes,
          onPress: () => {
            logoutUser(navigationRef);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return {onLogout};
};
