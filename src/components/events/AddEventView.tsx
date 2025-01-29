import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { Group } from "~/types/group";
import { MyAvatar } from "../avatar/MyAvatar";
import { createStyleSheet } from "./style";

interface AddEventViewProps {
  placeholder?: string;
  group?: Group;
}
export const AddEventView = ({ placeholder, group }: AddEventViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { gotoCreateEvent } = useNavigations();

  const handlePress = () => {
    gotoCreateEvent({ groupId: group?.id });
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
              {placeholder || strings.addEventPlaceholder}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
