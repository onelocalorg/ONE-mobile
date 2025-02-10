import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Screens } from "~/navigation/types";
import { Group } from "~/types/group";
import { MyAvatar } from "../avatar/MyAvatar";
import { createStyleSheet } from "./style";

interface AddGroupViewProps {
  placeholder?: string;
  parent?: Group;
}
export const AddGroupView = ({ placeholder, parent }: AddGroupViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(Screens.CREATE_GROUP, { parentId: parent?.id });
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mainPostCont}
        onPress={handlePress}
      >
        <View style={styles.postContainer}>
          <MyAvatar className="pl-2" />
          <View style={styles.postInput}>
            <Text style={{ textAlign: "left", color: "gray" }}>
              {placeholder || strings.createGroup}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
