import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { MyAvatar } from "~/components/avatar/MyAvatar";
import { Group } from "~/types/group";
import { createStyleSheet } from "./style";

interface AddPostViewProps {
  placeholder?: string;
  group?: Group;
}
export const AddPostView = ({ placeholder, group }: AddPostViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { gotoCreatePost } = useNavigations();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mainPostCont}
        onPress={() => gotoCreatePost({ groupId: group?.id })}
      >
        <View style={styles.postContainer}>
          <MyAvatar className="pl-2" />
          <View style={styles.postInput}>
            <Text style={{ textAlign: "left", color: "gray" }}>
              {placeholder || strings.addPostPlaceholder}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
