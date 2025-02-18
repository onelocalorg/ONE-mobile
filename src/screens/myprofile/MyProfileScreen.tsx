import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import { CheckCircleIcon } from "lucide-react-native";
import React, { useContext, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { Menu } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { MyAvatar } from "~/components/avatar/MyAvatar";
import { ImageUploader } from "~/components/ImageUploader";
import { Loader } from "~/components/loader";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Button, ButtonText } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { HStack } from "~/components/ui/hstack";
import { CloseCircleIcon, Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import { AppContext } from "~/navigation/AppContext";
import { useMyUserId } from "~/navigation/AuthContext";
import {
  ChapterMutations,
  useChapterService,
} from "~/network/api/services/useChapterService";
import { usePayoutService } from "~/network/api/services/usePayoutService";
import {
  UserMutations,
  useUserService,
} from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { FileKey } from "~/types/upload-file-data";
import { Url } from "~/types/url";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";
import { findChapter, toCurrency } from "~/utils/common";
import { LogoutPressable } from "./LogoutPressable";
import { MyEvents } from "./MyEvents";
import { ProfileEditor } from "./ProfileEditor";
import { createStyleSheet } from "./style";

export const MyProfileScreen = () => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const myUserId = useMyUserId();
  const { setChapterFilter } = useContext(AppContext)!;

  const [isChapterPickerVisible, setChapterPickerVisible] = useState(false);
  const openMenu = () => setChapterPickerVisible(true);
  const closeMenu = () => setChapterPickerVisible(false);
  const [isErrorDisplayVisible, setErrorDisplayVisible] = useState(false);
  const openErrorDisplay = () => setErrorDisplayVisible(true);
  const closeErrorDisplay = () => setErrorDisplayVisible(false);

  const {
    queries: { me: getMe },
  } = useUserService();
  const { isLoading, data: myProfile } = useQuery(getMe());

  const {
    queries: { balance: getBalance },
  } = usePayoutService();
  const { data: balance } = useQuery(getBalance());

  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: chapters } = useQuery(listChapters());

  const { mutate: getAccountLinkUrl } = useMutation<Url, Error, string>({
    mutationKey: [UserMutations.configureTransfers],
  });

  const { isPending: isUpdateUserPending, mutate: updateUserProfile } =
    useMutation<UserProfile, Error, UserProfileUpdateData>({
      mutationKey: [UserMutations.updateUser],
    });

  const { mutate: deleteUser } = useMutation<never, Error, string>({
    mutationKey: [UserMutations.deleteUser],
  });

  const { mutate: joinChapter } = useMutation<void, Error, string>({
    mutationKey: [ChapterMutations.joinChapter],
  });

  const isStripeConfigured = () =>
    myProfile?.stripe &&
    myProfile.stripe.requirements.currently_due.length === 0;

  const handleImageAdded = (image: ImageKey) => {
    updateUserProfile({
      id: myUserId!,
      pic: { key: image.key },
    });
  };

  const configureTransfers = () => {
    getAccountLinkUrl(myUserId!, {
      onSuccess: (data) => {
        void Linking.openURL(data.url).then((r) => console.log(r));
      },
    });
  };

  const deleteAccount = () => {
    Alert.alert(
      strings.deleteAccount,
      strings.areYouDeleteAccount,
      [
        { text: strings.no, onPress: () => null, style: "cancel" },
        {
          text: strings.yes,
          onPress: () => {
            deleteUser(myUserId!);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getDisabledReason = () => {
    let reason;
    switch (myProfile?.stripe?.requirements.disabled_reason) {
      case "requirements.past_due":
        reason =
          "Payments need to be configured. Please click the button below to configure payments";
        break;
      case "requirements.pending_verification":
        reason = "Payments are pending verification";
        break;
      default:
        reason = myProfile?.stripe?.requirements.disabled_reason;
    }
    return reason;
  };

  return (
    <>
      <Loader visible={isLoading || isUpdateUserPending} showOverlay={true} />
      <ScrollView>
        {myProfile ? (
          <>
            <View style={styles.innerContainer}>
              <Menu
                visible={isChapterPickerVisible}
                onDismiss={closeMenu}
                anchor={
                  <Pressable onPress={openMenu}>
                    <HStack>
                      <Text className="font-semibold pr-1">Home chapter:</Text>
                      <Text className="pr-0.5">
                        {myProfile.homeChapter?.id
                          ? findChapter(myProfile.homeChapter?.id, chapters)
                              ?.name
                          : "None"}
                      </Text>
                      <Text>{"\u25BC"}</Text>
                    </HStack>
                  </Pressable>
                }
              >
                {chapters?.map((chapter) => (
                  <Menu.Item
                    key={chapter.id}
                    onPress={() => {
                      joinChapter(chapter.id);
                      setChapterFilter(chapter);
                      closeMenu();
                    }}
                    title={chapter.name}
                  />
                ))}
              </Menu>
              {balance && (
                <VStack>
                  <HStack>
                    <Text className="font-semibold pr-1">Balance:</Text>
                    <Text>{toCurrency(balance.available[0].amount)}</Text>
                  </HStack>
                  <HStack className="items-center">
                    <Text className="font-semibold pr-1">Payouts enabled:</Text>
                    {myProfile?.stripe?.payouts_enabled ? (
                      <Icon as={CheckCircleIcon} className="color-green-500" />
                    ) : (
                      <>
                        <Icon as={CloseCircleIcon} className="color-red-500" />
                        {!_.isEmpty(myProfile?.stripe?.requirements.errors) && (
                          <Button
                            size="xs"
                            className="ml-2 w-5/12"
                            action="negative"
                            onPress={openErrorDisplay}
                          >
                            <ButtonText>See errors</ButtonText>
                          </Button>
                        )}
                      </>
                    )}
                  </HStack>
                  {myProfile?.stripe?.payouts_enabled ? (
                    <Text size="xs">
                      Payouts sent to your bank account automatically.
                    </Text>
                  ) : (
                    <Text className="color-red-500">{getDisabledReason()}</Text>
                  )}
                </VStack>
              )}
              <Text>{myProfile.email}</Text>
            </View>

            <ImageUploader
              id={myUserId}
              uploadKey={FileKey.pic}
              onImageUpload={handleImageAdded}
            >
              <MyAvatar className="p-2" size="2xl" />
            </ImageUploader>

            <View style={styles.line} />
            {myProfile && (
              <ProfileEditor
                userProfile={myProfile}
                saveProfile={updateUserProfile}
              />
            )}

            {!isStripeConfigured() ? (
              <Button className="m-4" onPress={configureTransfers}>
                <ButtonText>Configure payments</ButtonText>
              </Button>
            ) : (
              <Text>Payments configured :)</Text>
            )}

            <View style={styles.line} />

            <View style={styles.innerContainer}>
              <Text style={styles.membership}>My events</Text>
            </View>
            <MyEvents user={myProfile} />

            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.deleteAccount}>{strings.deleteAccount}</Text>
            </TouchableOpacity>
            <Text>
              Build: {getReadableVersion()} -{" "}
              {process.env.API_URL?.includes("prod.onelocal.one")
                ? "Production"
                : process.env.API_URL?.includes("beta.onelocal.one")
                ? "Beta"
                : process.env.API_URL?.includes("dev.onelocal.one")
                ? "Dev"
                : `??? ${process.env.API_URL}`}
            </Text>
            <View style={{ height: 40 }}></View>
          </>
        ) : (
          <View style={{ position: "absolute", right: 10, top: 60 }}>
            <LogoutPressable />
          </View>
        )}
      </ScrollView>
      <AlertDialog
        isOpen={isErrorDisplayVisible}
        onClose={closeErrorDisplay}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Errors preventing payouts
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            {myProfile?.stripe?.requirements.errors.map((error) => (
              <Text key={error.code} size="sm" className="color-red-500">
                {error.reason}
              </Text>
            ))}
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={closeErrorDisplay}
              size="sm"
            >
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
