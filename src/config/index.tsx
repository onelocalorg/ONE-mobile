import { logger } from "react-native-logs";

const config = {
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  stringifyFunc: (msg: any) => JSON.stringify(msg, null, "  "),
};

var LOG = logger.createLogger(config);

export { LOG };
