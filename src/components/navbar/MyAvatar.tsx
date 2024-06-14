import { useContext } from "react";
import { Pressable, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { AuthContext } from "~/navigation/AuthContext";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

type MyAvatarProps = {
  onPress?: () => void;
};
export const MyAvatar = ({ onPress }: MyAvatarProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { myProfile } = useContext(AuthContext);

  console.log("MyAvatar user", myProfile);

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
