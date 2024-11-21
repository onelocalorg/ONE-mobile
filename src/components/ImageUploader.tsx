import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Alert, Pressable } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useMyUserId } from "~/navigation/AuthContext";
import { UserMutations } from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { RemoteImage } from "~/types/remote-image";
import { FileKey, UploadFileData } from "~/types/upload-file-data";

interface ImageChooserProps {
  id?: string;
  uploadKey: FileKey;
  onImageUpload: (image: ImageKey) => void;
  onLoading?: (isLoading: boolean) => void;
  children: React.ReactNode;
}
export const ImageUploader = ({
  id,
  uploadKey,
  onImageUpload,
  onLoading,
  children,
}: ImageChooserProps) => {
  const myUserId = useMyUserId();
  const { isPending, mutate: uploadFile } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

  useEffect(() => {
    onLoading?.(isPending);
  }, [onLoading, isPending]);

  const chooseImage = async () => {
    try {
      const {
        mime,
        data: base64,
        filename,
      } = await ImagePicker.openPicker({
        width: 900,
        height: 900,
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
            userId: myUserId,
            uploadKey,
            imageName: filename || (id ?? (Math.random() * 100000).toString()),
            mimeType: mime || "image/jpg",
            base64,
          },
          {
            onSuccess(uploadedFile) {
              onImageUpload({
                key: uploadedFile.key,
                url: uploadedFile.imageUrl,
              });
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

  return <Pressable onPress={chooseImage}>{children}</Pressable>;
};
