import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash/fp";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { ImageComponent } from "~/components/image-component";
import { LOG } from "~/config";
import { createStyleSheet } from "../screens/createEditPost/style";

interface ImageUploaderProps {
  onLoading?: (isLoading: boolean) => void;
  onChangeImages?: (keys: string[]) => void;
}
export const ImageUploader = ({
  onLoading,
  onChangeImages,
}: ImageUploaderProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  interface ImageEntry {
    key: string;
    imageUrl: string;
  }

  const [images, setImages] = useState<ImageEntry[]>([]);

  const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const token = await AsyncStorage.getItem("token");
    const pic: any = {
      uploadKey: "createPostImg",
      imageName: fileItem,
      base64String: "data:image/jpeg;base64," + base64Item,
    };

    LOG.debug("> postImageUploadAPI");
    try {
      onLoading?.(true);

      const response = await fetch(
        process.env.API_URL + "/v3/users/upload/file",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(pic),
        }
      );
      const data = (await response.json())?.data;
      LOG.debug("< postImageUploadAPI", data);
      if (data) {
        setImages([...images, data]);
      }
      notifyImagesChanged();
      onLoading?.(true);
    } catch (error) {
      LOG.error("postImageUploadAPI", error);
      onLoading?.(false);
    }
  };

  const GallerySelect = async () => {
    const { assets } = await launchImageLibrary({
      mediaType: "photo",
      // selectionLimit: 2,
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    console.log(assets);
    if (assets) {
      const img = assets?.[0];
      console.log("---------------assets Gallery 222---------------");
      console.log(assets);
      const fileNameTwo = img?.fileName ?? "";
      //   LodingData(true);
      const output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      const base64Two = img?.base64 ?? "";
      postImageUploadAPI(output, base64Two);
    }
  };

  const removeSelectImage = (imageKey: string) => {
    setImages(_.filter((entry: ImageEntry) => entry.key !== imageKey));
    notifyImagesChanged();
  };

  const notifyImagesChanged = () => {
    onChangeImages?.(_.map((ie: ImageEntry) => ie.key, images));
  };

  return (
    <View>
      <TouchableOpacity onPress={GallerySelect} style={styles.imagesCont}>
        <Text style={styles.textTwo}>Image</Text>
        <Text style={styles.textTwo}>+</Text>
        <Text style={styles.textThree}>add images</Text>
      </TouchableOpacity>

      <View style={styles.multipleImagecont}>
        {images.map((ie) => {
          return (
            <TouchableOpacity
              key={ie.key}
              onPress={() => removeSelectImage(ie.key)}
            >
              <ImageComponent
                source={{ uri: ie.imageUrl }}
                style={styles.selectImage}
              ></ImageComponent>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
