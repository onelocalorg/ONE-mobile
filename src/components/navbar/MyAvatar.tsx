import { useQuery } from "@tanstack/react-query";
import { Pressable, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { useMyUserId } from "~/navigation/AuthContext";
import { useUserService } from "~/network/api/services/useUserService";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

type MyAvatarProps = {
  onPress?: () => void;
};
export const MyAvatar = ({ onPress }: MyAvatarProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const myUserId = useMyUserId();

  const {
    queries: { detail: getUser },
  } = useUserService();

  const { isError, data: myProfile, error } = useQuery(getUser(myUserId));

  return (
    <View>
      <Pressable style={styles.profileView} onPress={onPress}>
        <ImageComponent
          resizeMode="cover"
          isUrl={!!myProfile?.pic.url}
          source={defaultUser}
          uri={myProfile?.pic.url}
          style={styles.profile}
        />
      </Pressable>
    </View>
  );
};
