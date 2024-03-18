import React, { useEffect, useState } from "react";
import { Route } from "./route";
import { AppUpdate } from "@components/app-update";
import {
  ANDROID_VERSION,
  API_URL,
  IOS_VERSION,
  setData,
} from "@network/constant";
import { Platform } from "react-native";

export const AppNavigation = () => {
  const [showUpdateIOS, setShowUpdateIOS] = useState(false);
  const [showUpdateAndroid, setShowUpdateAndroind] = useState(false);
  const [isVersionApiCalled, setisVersionApiCalled] = useState(false);

  useEffect(() => {
    setData("isShowPaymentFlow", true);
    getAppVersion();
  }, []);

  const getAppVersion = async () => {
    var eventList_url = API_URL + "/v1/config/verions";
    try {
      const response = await fetch(eventList_url, { method: "get" });
      const dataItem = await response.json();
      console.log("-----------App Version--------------", dataItem);
      if (dataItem.success) {
        if (Platform.OS === "ios") {
          checkPaymentFlowHideShow(dataItem.data);
          iosVersionCheck(dataItem.data);
        } else {
          setisVersionApiCalled(true)
          androidVersionCheck(dataItem.data);
        }
        
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  function checkPaymentFlowHideShow(dataItem: any) {
    
    if ("isPaymentFlowShowOne" in dataItem) {
      var datatemp = dataItem?.isPaymentFlowShowOne;
      setData("isShowPaymentFlow", datatemp);
    }
    setisVersionApiCalled(true)
  }

  function iosVersionCheck(dataIOS: any) {
    if (IOS_VERSION < dataIOS.ios_version) {
      if (dataIOS.isForceforIOS) {
        setShowUpdateIOS(true);
      } else if (dataIOS.inMaintananceIOS) {
        setShowUpdateIOS(true);
      } else {
        setShowUpdateIOS(false);
      }
    } else {
      setShowUpdateIOS(false);
    }
  }

  function androidVersionCheck(dataAndroid: any) {
    if (ANDROID_VERSION < dataAndroid.android_version) {
      if (dataAndroid.isForceforAndroid) {
        setShowUpdateAndroind(true);
      } else if (dataAndroid.inMaintananceAndroid) {
        setShowUpdateAndroind(true);
      } else {
        setShowUpdateAndroind(false);
      }
    } else {
      setShowUpdateAndroind(false);
    }
  }

  return (
    <>
    {isVersionApiCalled ? <Route /> : <></>}
      

      {Platform.OS === "ios" ? (
        <>{showUpdateIOS && <AppUpdate />}</>
      ) : (
        <>{showUpdateAndroid && <AppUpdate />}</>
      )}
    </>
  );
};
