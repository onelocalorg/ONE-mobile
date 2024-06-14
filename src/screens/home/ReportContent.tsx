import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { buttonArrowGreen } from "~/assets/images";
import { ShortModal } from "~/components/ShortModal";
import { ImageComponent } from "~/components/image-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { reportPost } from "~/network/api/services/post-service";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const ReportContent = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.REPORT_CONTENT_MODAL>) => {
  const postId = route.params.postId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [isLoading, setLoading] = useState(false);
  const [reportReason, setReportReason] = useState<string>();

  const submitReportReason = async () => {
    if (!reportReason) {
      Toast.show("Add Reason", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);

      try {
        await reportPost(postId, reportReason);
        navigation.goBack();
        Toast.show("Report Submit successfully", Toast.LONG, {
          backgroundColor: "black",
        });
      } catch (e) {
        handleApiError("Error reporting post", e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ShortModal height={200}>
      <Text style={styles.gratiesTitle}>Report Content</Text>
      <View>
        <TextInput
          onChangeText={(text) => setReportReason(text)}
          style={styles.commentInput}
          placeholder="Add Reason"
        ></TextInput>
      </View>
      <TouchableOpacity
        onPress={() => submitReportReason()}
        activeOpacity={0.8}
        style={styles.purchaseContainer}
      >
        <View />
        <Text style={styles.titleTwo}>Submit</Text>
        <View>
          <ImageComponent
            source={buttonArrowGreen}
            style={styles.buttonArrow}
          />
        </View>
      </TouchableOpacity>
    </ShortModal>
  );
};
