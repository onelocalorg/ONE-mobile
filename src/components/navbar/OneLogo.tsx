import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { onelogo } from "~/assets/images";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

type OneLogoProps = {
  localText: string;
};
export const OneLogo = ({ localText }: OneLogoProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <View style={styles.oneContainer}>
      <ImageComponent
        style={styles.oneContainerImage}
        source={onelogo}
      ></ImageComponent>
      <View>
        <Text style={styles.oneContainerText}>NE</Text>
        <Text style={styles.localText}>{localText}</Text>
      </View>
    </View>
  );
};
