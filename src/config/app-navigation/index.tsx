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
        iosVersionCheck(dataItem.data);
      }
    } catch (error) {
      console.log(error); 
    }
  };

  function iosVersionCheck(dataIOS:any){
    if (IOS_VERSION < dataIOS.ios_version) {
      if (dataIOS.isForceforIOS) {
        setShowUpdate(true);
      }else if (dataIOS.inMaintananceIOS) { 
        setShowUpdate(true);
      }else{
        setShowUpdate(false);
      } 
    } else{
      setShowUpdate(false);
    }
  }


  return (
    <>
      <Route /> 
      {showUpdate && <AppUpdate />}
    </>
  );
};