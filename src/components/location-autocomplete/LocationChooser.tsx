import { UseFormSetValue } from "react-hook-form";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { pin } from "~/assets/images";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { PostUpdateData } from "~/types/post-update-data";
import { ImageComponent } from "../image-component";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { createStyleSheet } from "./style";

interface LocationChooserProps {
  value: string | undefined;
  onChange: (...event: any[]) => void;
  setValue: UseFormSetValue<PostUpdateData | LocalEventUpdateData>;
}
export const LocationChooser = ({
  value,
  onChange,
  setValue,
}: LocationChooserProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <View style={styles.createPostContTwo}>
      <LocationAutocomplete
        placeholder="Location"
        address={value}
        onPress={(data, details) => {
          onChange(data.description);
          if (details) {
            setValue("coordinates", [
              details.geometry.location.lng,
              details.geometry.location.lat,
            ]);
          }
        }}
      />

      <ImageComponent
        resizeMode="cover"
        source={pin}
        style={styles.createImgTwo}
      ></ImageComponent>
    </View>
  );
};
