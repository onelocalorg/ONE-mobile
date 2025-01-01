import { ScrollView, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { ImageComponent } from "~/components/image-component";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

type RecentUsersProps = {
  users: OneUser[];
};
export const RecentUsers = ({ users }: RecentUsersProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoUserProfile } = useNavigations();

  return (
    <View style={styles.avatarContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {users.map((user) => (
          <TouchableOpacity key={Math.random()} onPress={gotoUserProfile(user)}>
            <ImageComponent
              style={styles.avatarImage}
              isUrl={!!user.pic}
              resizeMode="cover"
              uri={user.pic}
            ></ImageComponent>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
