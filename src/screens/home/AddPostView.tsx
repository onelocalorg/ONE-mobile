import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { defaultUser } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { AuthContext } from "~/navigation/AuthContext";
import { createStyleSheet } from "./style";

type AddPostView = {
  onPress?: () => void;
};
export const AddPostView = ({ onPress }: AddPostView) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { myProfile } = useContext(AuthContext);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mainPostCont}
        onPress={onPress}
      >
        <View style={styles.postContainer}>
          <ImageComponent
            style={styles.avatar}
            resizeMode="cover"
            isUrl={!!myProfile?.pic}
            source={defaultUser}
            uri={myProfile?.pic}
          ></ImageComponent>
          <View style={styles.postInput}>
            <Text style={{ textAlign: "left", color: "gray" }}>
              What do you want to post?
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
