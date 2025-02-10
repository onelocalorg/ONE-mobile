import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Pressable } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { UserMutations } from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { RemoteImage } from "~/types/remote-image";
import { FileKey, UploadFileData } from "~/types/upload-file-data";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

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
  const { strings } = useStringsAndLabels();
  const [isNeedsPermissionVisible, setNeedsPermissionVisible] = useState(false);
  const closeNeedsPermissionAlert = () => {
    setNeedsPermissionVisible(false);
  };

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
            resourceId: id,
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
      const code = _.property("code", e) as string | undefined;
      if (code === "E_NO_LIBRARY_PERMISSION") {
        setNeedsPermissionVisible(true);
      } else {
        const message = _.property("message", e) as string | undefined;
        if (message === "User cancelled image selection") {
          console.log("User cancelled image selection");
        } else {
          throw e;
        }
      }
    }
  };

  return (
    <>
      <Pressable onPress={chooseImage}>{children}</Pressable>
      <AlertDialog
        isOpen={isNeedsPermissionVisible}
        onClose={closeNeedsPermissionAlert}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              {strings.photoPermissionsTitle}
            </Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <Box className="my-2">
            <Text>{strings.photoPermissionsError}</Text>
            {Platform.OS === "ios" && (
              <Text size="xs" className="mt-4">
                {strings.photoPermissionsDirectionsIos}
              </Text>
            )}
          </Box>
          <AlertDialogFooter>
            <Button size="sm" onPress={closeNeedsPermissionAlert}>
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
