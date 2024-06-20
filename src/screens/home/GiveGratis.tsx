import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen, gratis, minus, plus } from "~/assets/images";
import { ShortModal } from "~/components/ShortModal";
import { ImageComponent } from "~/components/image-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  PostMutations,
  SendGratisProps,
} from "~/network/api/services/usePostService";
import { Gratis } from "~/types/gratis";
import { createStyleSheet } from "./style";

export const GiveGratis = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.GIVE_GRATIS_MODAL>) => {
  const { postId, replyId } = route.params;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [numGratis, setNumGrats] = useState(10);

  const mutateGiveGratis = useMutation<Gratis, Error, SendGratisProps>({
    mutationKey: [PostMutations.giveGrats],
  });

  const gratisPlusClick = () => {
    setNumGrats((gratis: number) => gratis + 1);
  };

  const gratisMinusClick = () => {
    setNumGrats((gratis: number) => (gratis > 10 ? gratis - 1 : gratis));
  };

  const handlePress = () => {
    mutateGiveGratis.mutate(
      {
        postId,
        replyId,
        points: gratis,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  return (
    <ShortModal height={220}>
      <Text style={styles.gratiesTitle}>{strings.giveSomeGratis}</Text>
      <View style={styles.gratisCont}>
        <TouchableOpacity onPress={gratisMinusClick}>
          <ImageComponent
            source={minus}
            style={{
              height: 30,
              width: 30,
              marginRight: 50,
            }}
          ></ImageComponent>
        </TouchableOpacity>
        <ImageComponent
          resizeMode="cover"
          style={styles.gratisimg}
          source={gratis}
        ></ImageComponent>
        <Text style={styles.gratistext}>{numGratis}</Text>
        <TouchableOpacity onPress={gratisPlusClick}>
          <ImageComponent
            source={plus}
            style={{
              height: 30,
              width: 30,
              marginLeft: 50,
            }}
          ></ImageComponent>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.purchaseContainer}
      >
        <View />
        <Text style={styles.titleTwo}>{strings.give}</Text>
        <ImageComponent source={buttonArrowGreen} style={styles.buttonArrow} />
      </TouchableOpacity>
    </ShortModal>
  );
};
