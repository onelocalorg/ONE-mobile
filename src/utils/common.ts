import Big from "big.js";
import _ from "lodash/fp";
import { DateTime, Interval } from "luxon";
import { Alert } from "react-native";

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

// FIXME when this is called, gets a weird error
// @ts-ignore Property 'convert' does not exist on type 'LodashMapValues'.
export const mapValuesWithKey = _.mapValues.convert({ cap: false });

export const handleApiError = (title: string, e: any) => {
  // Added to handle old token
  // TODO Manage properly with storing and using refresh token
  // if (e?.code === HttpStatusCode.Unauthorized) {
  //   handleSignOut();
  // } else {
  Alert.alert(title, e?.message ?? e);
  // }
};
