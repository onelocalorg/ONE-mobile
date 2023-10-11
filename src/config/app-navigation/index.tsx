import React, {useEffect, useState} from 'react';
import {Route} from './route';
import {AppUpdate} from '@components/app-update';
import {useAppConfig} from '@network/hooks/user-service-hooks/use-app-config';
import {Loader} from '@components/loader';
import {Platform} from 'react-native';
import {appVersion} from '@assets/constants';

export const AppNavigation = () => {
  const {data, isRefetching} = useAppConfig();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (data) {
      if (Platform.OS === 'ios') {
        setShowUpdate(data?.ios?.version > appVersion?.ios);
      } else if (Platform.OS === 'android') {
        setShowUpdate(data?.android?.version > appVersion?.android);
      }
    }
  }, [data]);

  if (isRefetching) {
    return <Loader visible={isRefetching} />;
  }

  return (
    <>
      <Route />
      {showUpdate && <AppUpdate />}
    </>
  );
};
