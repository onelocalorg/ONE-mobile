import Big from "big.js";
import _ from "lodash/fp";
import { DateTime, Interval } from "luxon";
import { Alert } from "react-native";
import { LOG } from "~/config";

// const { handleSignOut } = useContext(AuthDispatchContext);

export const formatPrice = (price: string) => {
  return `$${price?.replace("USD", "")}`;
};

export const formatTimeFromNow = (dt: DateTime) => {
  const dur = Interval.fromDateTimes(dt, DateTime.now()).toDuration();

  const seconds = dur.as("seconds");
  if (seconds < 60) {
    return `${seconds.toFixed(0)} seconds ago`;
  }

  const minutes = dur.as("minutes");
  if (minutes < 60) {
    return `${minutes.toFixed(0)} minutes ago`;
  }

  const hours = dur.as("hours");
  if (hours < 24) {
    return `${hours.toFixed(0)} hours ago`;
  }

  return `${dur.as("days").toFixed(0)} days ago`;
};

export const toCents = (val: Big) => val.times(2).round().toNumber();

export const toCurrency = (val?: number) =>
  `$${!val ? "0.00" : Big(val).div(100).toFixed(2)}`;

// @ts-expect-error Property 'convert' does not exist on type 'LodashMapValues'.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
export const mapValuesWithKey = _.mapValues.convert({ cap: false });

export const handleApiError = _.curry((resource: string, e: Error | null) => {
  LOG.error(`Failure with ${resource}`, e?.message ?? e);
  // Added to handle old token
  // TODO Manage properly with storing and using refresh token
  // if (e?.code === HttpStatusCode.Unauthorized) {
  //   handleSignOut();
  // } else {
  if (e) {
    Alert.alert(`Failure with ${resource}`, e?.message ?? e);
  }
  // }
});
