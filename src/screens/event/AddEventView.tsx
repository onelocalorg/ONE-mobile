import { useQuery } from "@tanstack/react-query";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { useUserService } from "~/network/api/services/user-service";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

type AddEventView = {
  onPress?: () => void;
};
export const AddEventView = ({ onPress }: AddEventView) => {
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
              What event do you want to create?
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
