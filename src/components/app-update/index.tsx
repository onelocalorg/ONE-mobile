import { useEffect, useState } from "react";
import { Linking, Platform, Text, View } from "react-native";
import semver from "semver";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { LOG } from "~/config";
import { ANDROID_VERSION, IOS_VERSION, setData } from "~/network/constant";
import { createStyleSheet } from "./style";

type AppUpdateProps = {
  onNeedsUpdate: (isUpdateNeeded: boolean) => void;
};
export const AppUpdate = ({ onNeedsUpdate }: AppUpdateProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const [showUpdateIOS, setShowUpdateIOS] = useState(false);
  const [showUpdateAndroid, setShowUpdateAndroind] = useState(false);
  const [isVersionApiCalled, setisVersionApiCalled] = useState(false);

  useEffect(() => {
    getAppVersion();
  }, []);

  const getAppVersion = async () => {
    LOG.debug("> getAppVersion");
    const eventList_url = process.env.API_URL + "/v1/config/verions";
    LOG.info(eventList_url);
    try {
      const response = await fetch(eventList_url, { method: "get" });
      const dataItem = await response.json();
      LOG.info(response.status);
      LOG.debug("getAppVersion: ", dataItem?.data);
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
      const datatemp = dataItem?.isPaymentFlowShowFour;
      setData("isShowPaymentFlow", datatemp);
    }
    setisVersionApiCalled(true);
  }

  function checkPaymentFlowHideShowAndroid(dataItem: any) {
    if ("isPaymentFlowShowFiveAndroid" in dataItem) {
      console.log("isPaymentFlowShowFiveAndroid");
      const datatemp = dataItem?.isPaymentFlowShowFiveAndroid;
      setData("isShowPaymentFlowAndroid", datatemp);
    }
    setisVersionApiCalled(true);
  }

  function iosVersionCheck(dataIOS: any) {
    if (semver.lt(IOS_VERSION, dataIOS.ios_version)) {
      if (dataIOS.isForceforIOS) {
        setShowUpdateIOS(true);
        onNeedsUpdate(true);
      } else if (dataIOS.inMaintananceIOS) {
        setShowUpdateIOS(true);
      } else {
        setShowUpdateIOS(false);
        onNeedsUpdate(false);
      }
    } else {
      setShowUpdateIOS(false);
      onNeedsUpdate(false);
    }
  }

  function androidVersionCheck(dataAndroid: any) {
    if (semver.lt(ANDROID_VERSION, dataAndroid.android_version)) {
      if (dataAndroid.isForceforAndroid) {
        setShowUpdateAndroind(true);
        onNeedsUpdate(true);
      } else if (dataAndroid.inMaintananceAndroid) {
        setShowUpdateAndroind(true);
        onNeedsUpdate(false);
      } else {
        setShowUpdateAndroind(false);
        onNeedsUpdate(false);
      }
    } else {
      setShowUpdateAndroind(false);
      onNeedsUpdate(false);
    }
  }

  const onOpenAppStore = () => {
    if (Platform.OS === "ios") {
      const link =
        "itms-apps://apps.apple.com/id/app/one-local/id1534246640?l=id";
      Linking.canOpenURL(link).then(
        (supported) => {
          supported && Linking.openURL(link);
        },
        (err) => console.log(err)
      );
    } else {
      const link =
        "https://play.google.com/store/apps/details?id=one.onelocal.app";
      Linking.canOpenURL(link).then(
        (supported) => {
          supported && Linking.openURL(link);
        },
        (err) => console.log(err)
      );
    }
  };

  return (
    <>
      {showUpdateIOS || showUpdateAndroid ? (
        <View style={styles.container}>
          <Text style={styles.title}>{strings.updateAvailable}</Text>
          <ButtonComponent onPress={onOpenAppStore} title={strings.updateApp} />
        </View>
      ) : null}
    </>
  );
};
