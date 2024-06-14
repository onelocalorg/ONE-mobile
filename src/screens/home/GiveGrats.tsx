import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Gratis, buttonArrowGreen, minus, plus } from "~/assets/images";
import { ShortModal } from "~/components/ShortModal";
import { ImageComponent } from "~/components/image-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { sendGratis } from "~/network/api/services/post-service";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const GiveGrats = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.GIVE_GRATS_MODAL>) => {
  const postId = route.params.postId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const [numGrats, setNumGrats]: any = useState(10);

  const gratisPlusClick = () => {
    setNumGrats((numGrats: number) => numGrats + 1);
  };

  const gratisMinusClick = () => {
    setNumGrats((numGrats: number) =>
      numGrats > 10 ? numGrats - 1 : numGrats
    );
  };

  const giveGrats = async () => {
    try {
      await sendGratis(postId, numGrats);
      navigation.goBack();
    } catch (e) {
      handleApiError("Error sending Grats", e);
    }
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
          source={Gratis}
        ></ImageComponent>
        <Text style={styles.gratistext}>{numGrats}</Text>
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
        onPress={giveGrats}
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
