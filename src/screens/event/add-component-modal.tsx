/* eslint-disable react-hooks/exhaustive-deps */
import { useAppTheme } from "~/app-hooks/use-app-theme";
import React, { useCallback, useEffect, useState } from "react";
import { createStyleSheet } from "./style";
import { ModalComponent, ModalRefProps } from "~/components/modal-component";
import {
  Alert,
  Platform,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ImageComponent } from "~/components/image-component";
import {
  eventBlack,
  eventWhite,
  gratitudeBlack,
  offer,
  request,
} from "~/assets/images";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { navigations } from "~/config/app-navigation/constant";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { getData, setData } from "~/network/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";

import GestureRecognizer from "react-native-swipe-gestures";
import { Subscription } from "~/components/subcription";
import { MembershipCheckoutModal } from "~/screens/profile/membership-checkout-modal";
import { Loader } from "~/components/loader";

interface AddComponentModalProps {
  modalRef?: React.Ref<ModalRefProps>;
  navigation: NavigationContainerRef<ParamListBase>;
}

export const AddComponentModal = (props: AddComponentModalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isActiveSubs, setIsActiveSubs] = useState(false);
  const [iseventProducerModal, setEventProducerModal] = useState(false);
  const { modalRef, navigation } = props || {};
  const [isLoading, LodingData] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [postData, setDataEntries]: any = useState({});

  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as {
    user: { user_type: string; id: string };
  };
  const { data, refetch } = useUserProfile({
    userId: user?.id,
  });
  const { isActiveSubscription, eventProducerID } = data || {};
  console.log(data, "user data444");

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch();
      }
      console.log(user);
    }, [user, isActiveSubs])
  );

  useEffect(() => {
    packageDetailAPI();
  }, []);
  useFocusEffect(
    useCallback(() => {
      console.log("isActiveSubscription isActiveSubscription");
      if (isActiveSubscription === true) {
        AsyncStorage.setItem("isEventActive", "true");
      } else {
        AsyncStorage.setItem("isEventActive", "false");
      }
      setIsActiveSubs(isActiveSubscription);
    }, [isActiveSubscription])
  );

  //   const token = await AsyncStorage.getItem("token");
  //   try {
  //     const response = await fetch(process.env.API_URL + "/v1/users/" + user.id, {
  //       method: "get",
  //       headers: new Headers({
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }),
  //     });
  //     const dataItem = await response.json();
  //     seteventProducerID(dataItem?.data?.eventProducerPackageId);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onCheckReleaseHideShow = () => {
    if (Platform.OS === "ios") {
      const isShowPaymentCheck = getData("isShowPaymentFlow");
      return isShowPaymentCheck;
    } else {
      const isShowPaymentCheckAndroid = getData("isShowPaymentFlowAndroid");
      return isShowPaymentCheckAndroid;
    }
  };

  const onNavigate = async () => {
    const isEventPurched = await AsyncStorage.getItem("isEventActive");
    if (isEventPurched === "true") {
      navigation?.navigate(navigations.ADMIN_TOOLS, { isCreateEvent: true });
      const ref = modalRef as { current: { onCloseModal: () => void } };
      ref?.current?.onCloseModal();
    } else {
      setTimeout(() => {
        setEventProducerModal(true);
      }, 1000);
      packageDetailAPI();
    }
  };

  const onEventProducer = async () => {
    LodingData(true);
    setTimeout(() => {
      setMemberModal(true);
      LodingData(false);
    }, 1000);
  };

  const onEventDismiss = () => {
    setEventProducerModal(false);
    const ref = modalRef as { current: { onCloseModal: () => void } };
  };

  const onNavigateOfferPost = () => {
    setData("POST_TAB_OPEN_INDEX", 1);
    navigation?.navigate(navigations.CREATEPOST, { selecttypes: 1 });
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  const onNavigateRequestPost = () => {
    setData("POST_TAB_OPEN_INDEX", 2);
    navigation?.navigate(navigations.CREATEPOST, { selecttypes: 2 });
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  const onNavigateGratitude = () => {
    setData("POST_TAB_OPEN_INDEX", 3);
    navigation?.navigate(navigations.CREATEPOST, { selecttypes: 3 });
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  async function packageDetailAPI() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    console.log(
      process.env.API_URL + "/v1/subscriptions/packages/" + eventProducerID
    );
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/subscriptions/packages/" + eventProducerID,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log(dataItem);
      setDataEntries(dataItem?.data);
    } catch (error) {
      console.error(error);
    }
  }

  const renderView = (
    name: string,
    icon: number,
    enable: boolean,
    style?: StyleProp<ViewStyle>
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!enable}
        onPress={onNavigate}
        style={[styles.view, style]}
      >
        <ImageComponent source={icon} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const renderViewOffer = (
    name: string,
    icon: number,
    enable: boolean,
    style?: StyleProp<ViewStyle>
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!enable}
        onPress={onNavigateOfferPost}
        style={[styles.view, style]}
      >
        <ImageComponent source={icon} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const renderViewRequest = (
    name: string,
    icon: number,
    enable: boolean,
    style?: StyleProp<ViewStyle>
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!enable}
        onPress={onNavigateRequestPost}
        style={[styles.view, style]}
      >
        <ImageComponent source={icon} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const memberShipHide = () => {
    setMemberModal(false);
    setEventProducerModal(false);
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  const memberShipModalClose = () => {
    setMemberModal(false);
    navigation.navigate("profileroute");
    setEventProducerModal(false);
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  const renderViewGratitude = (
    name: string,
    icon: number,
    enable: boolean,
    style?: StyleProp<ViewStyle>
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!enable}
        onPress={onNavigateGratitude}
        style={[styles.view, style]}
      >
        <ImageComponent source={icon} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ModalComponent viewStyle={styles.modalContainer} ref={modalRef}>
        <View style={styles.optionsView}>
          {onCheckReleaseHideShow() ? (
            <>{renderView(strings.event, eventBlack, true)}</>
          ) : (
            <></>
          )}

          <View style={styles.row}>
            {renderViewOffer(strings.offer, offer, true, styles.greenView)}
            {renderViewRequest(
              strings.request,
              request,
              true,
              styles.greenView
            )}
            {renderViewGratitude(
              strings.gratitude,
              gratitudeBlack,
              true,
              styles.greenView
            )}
          </View>
        </View>
        <Modal
          transparent
          visible={iseventProducerModal}
          onDismiss={onEventDismiss}
        >
          <Loader visible={isLoading} showOverlay />
          <GestureRecognizer
            onSwipeDown={onEventDismiss}
            style={styles.gesture}
          >
            <TouchableOpacity
              style={styles.containerGallery}
              activeOpacity={1}
              onPress={onEventDismiss}
            />
          </GestureRecognizer>
          <TouchableOpacity activeOpacity={1} style={styles.modalMainContainer}>
            <TouchableOpacity style={styles.titleContainer} activeOpacity={0.8}>
              <ImageComponent
                source={{ uri: postData?.role_image }}
                style={styles.iconEvent}
              />
              <Text style={styles.label}>{postData?.title}</Text>
            </TouchableOpacity>

            <Text style={styles.playerDescription}>
              {postData?.description}
            </Text>

            <Subscription
              label={strings.signUp}
              pillStyle={styles.signUpStyle}
              backgroundColor="#DB9791"
              onPressPill={() => onEventProducer()}
            />
          </TouchableOpacity>

          {memberModal ? (
            <MembershipCheckoutModal
              memberModal={memberModal}
              onCancel={memberShipHide}
              dataId={eventProducerID}
              successData={memberShipModalClose}
            />
          ) : (
            <></>
          )}
        </Modal>
      </ModalComponent>
    </>
  );
};
