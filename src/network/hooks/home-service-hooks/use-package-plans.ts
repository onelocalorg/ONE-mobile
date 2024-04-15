import { onGetPackage } from "@network/api/services/home-service";
import { apiConstants, apiKeys } from "@network/constant";
import { useQuery } from "@tanstack/react-query";

export type Root = PlanData[];

export interface PlanData {
  title: string;
  image: string;
  price: string;
  description: string;
  id: string;
  status: string;
  key: string;
  color: string;
  role_image: any;
  membership_image: string;
}

export interface Price {
  $numberDecimal: string;
}

const subscriptionPackageParsedData = (data: Root) => {
  return data;
};

export const usePackagePlans = () => {
  const query = useQuery([apiConstants.package], onGetPackage, {
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { ...query, data: subscriptionPackageParsedData(query?.data?.data) };
};
