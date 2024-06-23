import "react-native-gesture-handler";

import notifee from "@notifee/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "~/network/reducers/store";
import { queryConfig } from "~/network/utils/query-config";
import { handleApiError } from "~/utils/common";
import { name as appName } from "./app.json";
import { App } from "./src/app";

const queryClient = new QueryClient(queryConfig);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log("onBackgroundEvent", type);

  // Display a notification
  try {
    await notifee.displayNotification({
      title: notification.title ?? "No title",
      body: notification.body ?? "No body",
    });
    await notifee.cancelNotification(notification.id);
  } catch (e) {
    handleApiError("Displaying notification", e);
  }
});

export default function Main() {
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
