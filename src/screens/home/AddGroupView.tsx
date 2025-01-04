import { useQuery } from "@tanstack/react-query";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { defaultUser } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { useUserService } from "~/network/api/services/useUserService";
import { createStyleSheet } from "./style";

export const AddGroupView = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoCreateGroup } = useNavigations();

  const myUserId = useMyUserId();

  const {
    queries: { detail: getUser },
  } = useUserService();

  const { data: myProfile } = useQuery(getUser(myUserId));

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mainPostCont}
        onPress={gotoCreateGroup}
      >
        <View style={styles.postContainer}>
          <ImageComponent
            style={styles.avatar}
            resizeMode="cover"
            isUrl={!!myProfile?.pic.url}
            source={defaultUser}
            uri={myProfile?.pic.url}
          ></ImageComponent>
          <View style={styles.postInput}>
            <Text style={{ textAlign: "left", color: "gray" }}>
              Create Group
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
