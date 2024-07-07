import { useMutation } from "@tanstack/react-query";
import { Alert, Pressable, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { UserMutations } from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { RemoteImage } from "~/types/remote-image";
import { FileKeys, UploadFileData } from "~/types/upload-file-data";
import { Loader } from "./loader";

interface ImageChooserProps {
  id?: string;
  onImageAdded: (images: [ImageKey]) => void;
  children: React.ReactNode;
}
export const ImageChooser = ({
  id,
  onImageAdded,
  children,
}: ImageChooserProps) => {
  const { isPending, mutate: uploadFile } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

  const chooseImage = async () => {
    try {
      const {
        mime,
        data: base64,
        filename,
      } = await ImagePicker.openPicker({
        width: 1200,
        height: 1200,
        cropping: true,
        mediaType: "photo",
        includeBase64: true,
        multiple: false,
        showsSelectedCount: false,
      });
      if (!base64) {
        Alert.alert("Image picker did not return data");
      } else {
        uploadFile(
          {
            uploadKey: FileKeys.createEventImage,
            imageName: filename || (id ?? (Math.random() * 100000).toString()),
            mimeType: mime || "image/jpg",
            base64,
          },
          {
            onSuccess(uploadedFile) {
              onImageAdded([
                {
                  key: uploadedFile.key,
                  url: uploadedFile.imageUrl,
                },
              ]);
            },
          }
        );
      }
    } catch (e) {
      if ((e as Error).message !== "User cancelled image selection") {
        console.error("Error choosing image", e);
      }
    }
  };

  return (
    <View>
      <Loader visible={isPending} />
      <Pressable onPress={chooseImage}>{children}</Pressable>
    </View>
  );
};
