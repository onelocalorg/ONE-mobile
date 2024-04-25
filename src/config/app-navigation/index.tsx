import React, { useEffect, useState } from "react";
import { Route } from "./route";
import { LOG } from "~/config";
import { AppUpdate } from "~/components/app-update";
import { ANDROID_VERSION, IOS_VERSION, setData } from "~/network/constant";
import { Platform } from "react-native";

export const AppNavigation = () => {
  const [showUpdateIOS, setShowUpdateIOS] = useState(false);
  const [showUpdateAndroid, setShowUpdateAndroind] = useState(false);
  const [isVersionApiCalled, setisVersionApiCalled] = useState(false);

  useEffect(() => {
    setData("isShowPaymentFlow", true);
    setData("isShowPaymentFlowAndroid", true);
    getAppVersion();
  }, []);

  const getAppVersion = async () => {
    LOG.debug("> getAppVersion");
    var eventList_url = process.env.API_URL + "/v1/config/verions";
    try {
      const response = await fetch(eventList_url, { method: "get" });
      const dataItem = await response.json();
      console.log("-----------App Version--------------", dataItem);
      if (dataItem.success) {
        if (Platform.OS === "ios") {
          isReleaseHideShow(dataItem.data);
          iosVersionCheck(dataItem.data);
          setData("mapCircleRadius", dataItem.data.mapCircleRadius);
        } else {
          isReleaseHideShow(dataItem.data);
          androidVersionCheck(dataItem.data);
          setData("mapCircleRadius", dataItem.data.mapCircleRadius);
        }
      }
      LOG.debug("< getAppVersion");
    } catch (error) {
      console.log(error);
    }
  };

  const isReleaseHideShow = (dataItem: any) => {
    if (Platform.OS === "ios") {
      checkPaymentFlowHideShow(dataItem);
    } else {
      checkPaymentFlowHideShowAndroid(dataItem);
    }
  };

  function checkPaymentFlowHideShow(dataItem: any) {
    if ("isPaymentFlowShowFour" in dataItem) {
      console.log("isPaymentFlowShowFour");
      var datatemp = dataItem?.isPaymentFlowShowFour;
      setData("isShowPaymentFlow", datatemp);
    }
    setisVersionApiCalled(true);
  }

  function checkPaymentFlowHideShowAndroid(dataItem: any) {
    if ("isPaymentFlowShowFiveAndroid" in dataItem) {
      console.log("isPaymentFlowShowFiveAndroid");
      var datatemp = dataItem?.isPaymentFlowShowFiveAndroid;
      setData("isShowPaymentFlowAndroid", datatemp);
    }
    setisVersionApiCalled(true);
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
