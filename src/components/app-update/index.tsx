import React from "react";
import { Linking, Platform, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { createStyleSheet } from "./style";

export const AppUpdate = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const onOpenAppStore = () => {
    if (Platform.OS === "ios") {
      const link = "itms-apps://itunes.apple.com/app/id/1534246640";
      Linking.canOpenURL(link).then(
        (supported) => {
          supported && Linking.openURL(link);
        },
        (err) => console.log(err)
      );
    } else {
      const link =
        "https://play.google.com/store/apps/details?id=one.oneboulder.one";
      Linking.canOpenURL(link).then(
        (supported) => {
          supported && Linking.openURL(link);
        },
        (err) => console.log(err)
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.updateAvailable}</Text>
      <ButtonComponent onPress={onOpenAppStore} title={strings.updateApp} />
    </View>
  );
};
