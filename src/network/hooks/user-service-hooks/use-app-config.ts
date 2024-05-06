import { useQuery } from "@tanstack/react-query";
import { onGetAppConfig } from "~/network/api/services/user-service";
import { apiKeys } from "~/network/constant";

export interface Root {
  ios: Ios;
  android: Android;
}

export interface Ios {
  version: string;
  is_update: boolean;
  is_maintenance: boolean;
}

export interface Android {
  version: string;
  is_update: boolean;
  is_maintenance: boolean;
}

const appConfigParsedData = (data: Root) => {
  return data;
};

export const useAppConfig = () => {
  const query = useQuery([apiKeys.appConfig], onGetAppConfig, {
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { ...query, data: appConfigParsedData(query?.data?.data) };
};
