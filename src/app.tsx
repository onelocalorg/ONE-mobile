import notifee from "@notifee/react-native";
import * as Sentry from "@sentry/react-native";
import { QueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { queryConfig } from "~/network/utils/query-config";
import { InternetConnectionHandle } from "~/utils/internet-connection-handle";
import "../global.css";
import { Loader } from "./components/loader";
import Authentication from "./navigation/Authentication";

Sentry.init({
  dsn: process.env.SENTRY_DNS,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  enableSpotlight: __DEV__,
});

export const queryClient = new QueryClient(queryConfig);
export const App = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function bootstrap() {
      // notifee
      //   .setBadgeCount(0)
      //   .then(() => console.log("Badge count removed"))
      //   .catch((e) => console.error("Could not remove badge count", e));

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
      .catch((err) => console.error("Failed bootstrap", err));
  }, []);

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
          <Authentication />
        </>
      )}
    </>
  );
};
