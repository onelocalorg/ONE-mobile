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

const LOG = logger.createLogger(config);

const error = (functionNume: string) => (e: any) => LOG.error(functionNume, e);

export { LOG, error };
