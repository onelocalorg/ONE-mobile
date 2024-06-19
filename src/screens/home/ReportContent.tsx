import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { buttonArrowGreen } from "~/assets/images";
import { ShortModal } from "~/components/ShortModal";
import { ImageComponent } from "~/components/image-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { usePostService } from "~/network/api/services/usePostService";
import { createStyleSheet } from "./style";

export const ReportContent = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.REPORT_CONTENT_MODAL>) => {
  const postId = route.params.postId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [reportReason, setReportReason] = useState<string>();

  const {
    mutations: { reportPost },
  } = usePostService();

  const { mutate } = useMutation(reportPost);

  const submitReportReason = () => {
    if (!reportReason) {
      Toast.show("Add Reason", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      mutate(
        {
          postId,
          reason: reportReason,
        },
        {
          onSuccess: () => {
            navigation.goBack();
            Toast.show("Report Submit successfully", Toast.LONG, {
              backgroundColor: "black",
            });
          },
        }
      );
    }
  };

  return (
    <ShortModal height={200}>
      <Text style={styles.gratiesTitle}>Report Content</Text>
      <View>
        <TextInput
          onChangeText={(text) => setReportReason(text)}
          style={styles.replyInput}
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
