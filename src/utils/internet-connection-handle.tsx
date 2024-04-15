import React from "react";
import { useInternetConnectionHandle } from "@app-hooks/use-internet-connection-handle";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

export const InternetConnectionHandle = () => {
  const { checkConnectivity } = useInternetConnectionHandle();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      checkConnectivity(state?.isConnected || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <></>;
};
