import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { useToken } from "~/app-hooks/use-token";
import { light } from "~/assets/constants";
import { LOG } from "~/config";
import { AppNavigation } from "~/config/app-navigation";
import { API } from "~/network/api";
import { queryConfig } from "~/network/utils/query-config";
import { InternetConnectionHandle } from "~/utils/internet-connection-handle";
import { initializeStripe } from "~/utils/stripe";
import { getTheme } from "./theme";

export const queryClient = new QueryClient(queryConfig);
const theme = getTheme(light);

export const App = () => {
  const { token } = useToken();

  useEffect(() => {
    initializeStripe();
  }, []);

  useEffect(() => {
    LOG.debug(
      `Launching app with environment ${process.env.NODE_ENV} and API_URL ${process.env.API_URL}`
    );
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      API.initService();
    }
  }, [token]);

  return (
    <>
      <InternetConnectionHandle />
      <StatusBar
        backgroundColor={"#003333"}
        barStyle={"light-content"}
        translucent={true}
      />
      <AppNavigation />
    </>
  );
};
