import {
  onGetPackage,
  onGetPackageDetail,
} from "~/network/api/services/home-service";
import { apiConstants, apiKeys } from "~/network/constant";
import { About } from "~/screens/profile/about";
import { useMutation, useQuery } from "@tanstack/react-query";

export type Root = PlanData[];

interface PlanData {
  title: string;
  image: string;
  price: string;
  description: string;
  id: string;
  status: string;
  key: string;
  color: string;
  defaultSignupText: string;
  role_image: number;
  membership_image: string;
}

export interface Price {
  $numberDecimal: string;
}

const subscriptionPackageDetailParsedData = (data: PlanData) => {
  return data;
};

export const usePackageDetailPlans = () => {
  const mutate = useMutation(onGetPackageDetail);

  return mutate;
};

// export const usePackageDetailPlans = (props: AboutProps) => {
//   const query = useQuery([apiKeys.packageDetail],() => onGetPackageDetail(props),
//     {
//       staleTime: 0,
//       refetchOnWindowFocus: false,
//       enabled: false,
//     },
//   );

//   return {...query, data: subscriptionPackageDetailParsedData(query?.data?.data)};
// };
