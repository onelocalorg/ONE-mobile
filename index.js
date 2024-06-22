import "react-native-gesture-handler";

import notifee from "@notifee/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { LOG } from "~/config";
import { store } from "~/network/reducers/store";
import { queryConfig } from "~/network/utils/query-config";
import { name as appName } from "./app.json";
import { App } from "./src/app";

const queryClient = new QueryClient(queryConfig);

LOG.debug("Registering notification handler");
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Display a notification
  return notifee.displayNotification({
    title: notification.title ?? "No title",
    body: notification.body ?? "No body",
  });

  // return Promise.resolve();

  // Check if the user pressed the "Mark as read" action
  // if (type === EventType.ACTION_PRESS && pressAction.id === "mark-as-read") {
  //   // Update external API
  //   // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
  //   //   method: "POST",
  //   // });

  //   // Remove the notification
  //   await notifee.cancelNotification(notification.id);
  // }
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
