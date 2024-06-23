import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Header } from "~/components/header";
import { getTheme } from "~/theme/index";
import { createStyleSheet } from "./style";

interface Params {
  params: {
    header?: string;
    uri: string;
    onUrlChange?: (url: string) => void;
    onPressBack?: () => void;
  };
}

export interface GenericWebViewProps {
  route?: Params;
  navigation?: NavigationContainerRef<ParamListBase>;
}

export interface RefObj {
  goBack: () => void;
  injectJavaScript: (data: string) => void;
}

export const GenericWebView = (props: GenericWebViewProps) => {
  const { themeType } = useAppTheme();
  const theme = getTheme(themeType);
  const styles = createStyleSheet(theme);
  const { navigation, route } = props;
  const [loading, setloading] = useState(false);
  const {
    header = "",
    onUrlChange,
    onPressBack,
    uri = "",
  } = route?.params ?? {};
  const [pageTitle, setPageTitle] = useState(header || "");

  const handleMessage = (messageEvent: WebViewMessageEvent) => {
    const { data } = messageEvent.nativeEvent;
    if (data) {
      setPageTitle(data);
    }
    if (data === "closed") {
      navigation?.goBack();
    }
  };

  const handleBackPress = () => {
    navigation?.goBack();
    onPressBack?.();
  };

  const urlChange = (newNavState: WebViewNavigation) => {
    const { url } = newNavState;
    onUrlChange?.(url);
  };

  return (
    <View style={styles.background}>
      <Header title={pageTitle} hasBackButton onBackPress={handleBackPress} />
      <WebView
        source={{ uri }}
        style={styles.webView}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setloading(nativeEvent.loading);
        }}
        onLoadEnd={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setloading(nativeEvent.loading);
        }}
        onMessage={handleMessage}
        startInLoadingState={loading}
        renderLoading={() => <ActivityIndicator size={"small"} />}
        onNavigationStateChange={urlChange}
      />
    </View>
  );
};
