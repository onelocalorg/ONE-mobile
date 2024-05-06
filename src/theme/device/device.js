import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const BASE_DIMENSIONS = Platform?.isPad
  ? {
      width: 1024,
      height: 600,
    }
  : {
      width: 375,
      height: 812,
    };

export { height, width };
