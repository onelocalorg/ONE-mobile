import { useQuery } from "@tanstack/react-query";
import { Pressable, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { useMyUserId } from "~/navigation/AuthContext";
import { useUserService } from "~/network/api/services/user-service";
import { handleApiError } from "~/utils/common";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

type MyAvatarProps = {
  onPress?: () => void;
};
export const MyAvatar = ({ onPress }: MyAvatarProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const { getUserProfile } = useUserService();
  const myUserId = useMyUserId();

  const {
    isError,
    data: myProfile,
    error,
  } = useQuery({
    queryKey: ["getUserProfile", myUserId],
    queryFn: () => getUserProfile(myUserId!),
    enabled: !!myUserId,
  });
  if (isError) handleApiError("User profile", error);

  return (
    <View>
      <Pressable style={styles.profileView} onPress={onPress}>
        <ImageComponent
          resizeMode="cover"
          isUrl={!!myProfile?.pic}
          source={defaultUser}
          uri={myProfile?.pic}
          style={styles.profile}
        />
      </Pressable>
    </View>
  );
};
