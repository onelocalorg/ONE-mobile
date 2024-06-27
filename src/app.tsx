import notifee from "@notifee/react-native";
import { QueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { queryConfig } from "~/network/utils/query-config";
import { InternetConnectionHandle } from "~/utils/internet-connection-handle";
import { AppUpdate } from "./components/app-update";
import { Loader } from "./components/loader";
import Authentication from "./navigation/Authentication";

export const queryClient = new QueryClient(queryConfig);
export const App = () => {
  const [isUpdateRequired, setUpdateRequired] = useState<boolean>();
  const [isNavigationVisible, setNavigationVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function bootstrap() {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        console.log(
          "Notification caused application to open",
          initialNotification.notification
        );
        console.log(
          "Press action used to open the app",
          initialNotification.pressAction
        );
      }
    }

    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error);
  }, []);

  const onNeedsUpdate = (isUpdateRequired: boolean) => {
    if (isUpdateRequired === false) {
      setNavigationVisible(true);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      {!isLoading && (
        <>
          <InternetConnectionHandle />
          <StatusBar
            backgroundColor={"#003333"}
            barStyle={"light-content"}
            translucent={true}
          />
          <AppUpdate onNeedsUpdate={onNeedsUpdate} />
          {isNavigationVisible ? <Authentication /> : null}
        </>
      )}
    </>
  );
};
