import "react-native-gesture-handler";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "~/network/reducers/store";
import { queryConfig } from "~/network/utils/query-config";
import { name as appName } from "./app.json";
import { App } from "./src/app";
export default function Main() {
  const queryClient = new QueryClient(queryConfig);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PaperProvider>
            <App />
          </PaperProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
