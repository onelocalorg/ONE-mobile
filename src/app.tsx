import { QueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { queryConfig } from "~/network/utils/query-config";
import { InternetConnectionHandle } from "~/utils/internet-connection-handle";
import { AppUpdate } from "./components/app-update";
import Authentication from "./navigation/Authentication";

export const queryClient = new QueryClient(queryConfig);
export const App = () => {
  const [isUpdateRequired, setUpdateRequired] = useState<boolean>();
  const [isNavigationVisible, setNavigationVisible] = useState(false);

  // const { token } = useToken();

  // useEffect(() => {
  //   LOG.debug(
  //     `Launching app with environment ${process.env.NODE_ENV} and API_URL ${process.env.API_URL}`
  //   );
  //   if (token) {
  //     axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  //     API.initService();
  //   }
  // }, [token]);

  const onNeedsUpdate = (isUpdateRequired: boolean) => {
    if (isUpdateRequired === false) {
      setNavigationVisible(true);
    }
  };

  return (
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
  );
};
