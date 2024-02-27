import React, {useEffect, useState} from 'react';
import {Route} from './route';
import {AppUpdate} from '@components/app-update';
import {Loader} from '@components/loader';
import { ANDROID_VERSION, API_URL, IOS_VERSION } from '@network/constant';

export const AppNavigation = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  
  useEffect(() => {
    getAppVersion();
  }, []);

  const getAppVersion = async () => {
    var eventList_url = API_URL + '/v1/config/verions';
    try {
      const response = await fetch(eventList_url, {method: 'get',});
      const dataItem = await response.json();
      console.log('-----------App Version--------------',dataItem);
      if (dataItem.success) {
        iosVersionCheck(dataItem.data.ios);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function iosVersionCheck(dataIOS:any){
    if (IOS_VERSION < dataIOS.version) {
      if (dataIOS.is_update) {
        setShowUpdate(true);
      }
      if (dataIOS.is_maintenance) {
        setShowUpdate(true);
      } 
    } 
  }


  return (
    <>
      <Route /> 
      {showUpdate && <AppUpdate />}
    </>
  );
};