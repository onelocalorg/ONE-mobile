import * as strings from "@assets/strings/strings-and-labels";

export type StringsAndLabelsType = {
  [value in string]: string;
};

export const useStringsAndLabels = () => {
  return {
    strings: strings.stringsAndLabels,
  };
};
