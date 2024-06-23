import React from "react";
import { Alert, Pressable, Text } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { AuthDispatchContext } from "~/navigation/AuthContext";

export const LogoutPressable = () => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();

  const { handleSignOut } = React.useContext(AuthDispatchContext);

  const confirmLogout = () => {
    Alert.alert(strings.logout, strings.confirmLogout, [
      { text: strings.no, onPress: () => null, style: "cancel" },
      {
        text: strings.yes,
        onPress: () => {
          handleSignOut();
        },
      },
    ]);
  };

  return (
    <Pressable onPress={confirmLogout}>
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.white,
          fontWeight: "500",
          fontFamily: theme.fontType.medium,
        }}
      >
        {strings.logout}
      </Text>
    </Pressable>
  );
};
