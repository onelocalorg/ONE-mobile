import "react-native-gesture-handler";
import "react-native-get-random-values";

import { initializeApp } from "@react-native-firebase/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppRegistry } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { name as appName } from "./app.json";
import { App } from "./src/app";
import { store } from "./src/network/reducers/store";
import { queryConfig } from "./src/network/utils/query-config";

const firebaseConfig = {
  apiKey: "AIzaSyAJiHyttLDtw5VqGgF1Iu8-Enbc7e7RrDs",
  authDomain: "OneBoulderMobile.firebaseapp.com",
  projectId: "onebouldermobile",
  messagingSenderId: "724751305903",
  appId: "1:724751305903:ios:18d211a88e5a6535be985a",
};

// Ensure Firebase is only initialized once
// if (!initializeApp.apps.length) {
initializeApp(firebaseConfig);
// }

export const queryClient = new QueryClient(queryConfig);
export default function Main() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <GestureHandlerRootView>
            <PaperProvider>
              <App />
            </PaperProvider>
          </GestureHandlerRootView>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
