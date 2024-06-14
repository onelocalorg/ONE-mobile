import { ScrollView, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ImageComponent } from "~/components/image-component";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

type RecentUsersProps = {
  users: OneUser[];
  onPress?: (user: OneUser) => void;
};
export const RecentUsers = ({ users, onPress }: RecentUsersProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  return (
    <View style={styles.avatarContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {users.map((user) => (
          <TouchableOpacity key={Math.random()} onPress={() => onPress?.(user)}>
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
