import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text } from "react-native";
import { Loader } from "~/components/loader";
import { useUserService } from "~/network/api/services/useUserService";

export const ConfirmStripeSetup = () => {
  const {
    queries: { me: getMe },
  } = useUserService();

  const { isLoading, data: me } = useQuery(getMe());

  return (
    <>
      <Loader visible={isLoading} showOverlay={true} />
      {me && (
        <>
          <Text>
            Is profile setup:{" "}
            {me.stripe && me.stripe.requirements.currently_due.length === 0
              ? "Yes"
              : "No"}
          </Text>
        </>
      )}
    </>
  );
};
