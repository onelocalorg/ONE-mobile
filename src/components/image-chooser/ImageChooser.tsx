import _ from "lodash/fp";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { ImageUploader } from "~/components/ImageUploader";
// import { ImageKey } from "~/types/image-info";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FileKey } from "~/types/upload-file-data";
import FontAwesomeSpin from "../FontAwesomeSpin";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

export interface ImageKey {
  key: string;
  url?: string;
}

interface ImageChooserProps {
  id?: string;
  uploadKey: FileKey;
  defaultValue?: ImageKey[];
  onChangeImages: (images: ImageKey[]) => void;
}
export const ImageChooser = ({
  id,
  uploadKey,
  defaultValue,
  onChangeImages,
}: ImageChooserProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [images, setImages] = useState(defaultValue ?? []);
  const [isLoading, setLoading] = useState(false);

  const handleImageUpload = (newImage: ImageKey) => {
    const updated = [...images, newImage];
    setImages(updated);
    onChangeImages(updated);
  };

  const handleImagePress = (keyToRemove: string) => {
    const updated = _.remove((i) => i.key === keyToRemove, images);
    setImages(updated);
    onChangeImages(updated);
  };

  return (
    <View style={{ height: 100, alignItems: "flex-start" }}>
      <ImageUploader
        id={id}
        uploadKey={uploadKey}
        onImageUpload={handleImageUpload}
        onLoading={setLoading}
      >
        <View style={styles.multipleImagecont}>
          {images.map((ie) => (
            <Pressable key={ie.key} onPress={() => handleImagePress(ie.key)}>
              <ImageComponent
                source={{ uri: ie.url }}
                style={styles.selectImage}
              ></ImageComponent>
            </Pressable>
          ))}
          <View key="new" style={styles.selectImage}>
            {isLoading ? (
              <FontAwesomeSpin>
                <FontAwesomeIcon icon={faSpinner} size={32} />
              </FontAwesomeSpin>
            ) : (
              <FontAwesomeIcon icon={faPlus} size={40} color="grey" />
            )}
          </View>
        </View>
      </ImageUploader>
    </View>
  );
};
