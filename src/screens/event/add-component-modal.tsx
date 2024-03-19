/* eslint-disable react-hooks/exhaustive-deps */
import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useState } from "react";
import { createStyleSheet } from "./style";
import { ModalComponent, ModalRefProps } from "@components/modal-component";
import {
  Alert,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ImageComponent } from "@components/image-component";
import { eventBlack, eventWhite, gratitudeBlack, offer, request } from "@assets/images";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { navigations } from "@config/app-navigation/constant";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import { UserProfileState } from "@network/reducers/user-profile-reducer";
import { useUserProfile } from "@network/hooks/user-service-hooks/use-user-profile";
import { getData, setData } from "@network/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { Subscription } from "@components/subcription";

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
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { user_type: string; id: string } };

  const { data, refetch } = useUserProfile({
    userId: user?.id,
  });
  const { isActiveSubscription } = data || {};
  const isShowPaymentCheck = getData("isShowPaymentFlow");
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user, isActiveSubs])
  );

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

  //   users API => isActiveSubscription == true
  //  Login API => user_type === 'eventProducer'

  // const onNavigate = async () => {
  //   const isEventPurched = await AsyncStorage.getItem("isEventActive");
  //   if (isEventPurched === "true") {
  //     navigation?.navigate(navigations.ADMIN_TOOLS, { isCreateEvent: true });
  //   } else {
  //     Alert.alert("", strings.purchaseSubscription);
  //   }
  //   const ref = modalRef as { current: { onCloseModal: () => void } };
  //   ref?.current?.onCloseModal();
  // };

  const onNavigate = async () => {
    const isEventPurched = await AsyncStorage.getItem("isEventActive");
    if (isEventPurched === "true") {
      navigation?.navigate(navigations.ADMIN_TOOLS, { isCreateEvent: true });
      const ref = modalRef as { current: { onCloseModal: () => void } };
      ref?.current?.onCloseModal();
    } else {
      // setEventProducerModal(true);
      Alert.alert("", strings.purchaseSubscription);
    }
  };

  const onEventProducer = () => {
    navigation.navigate("profileroute");
    setEventProducerModal(false)
    const ref = modalRef as { current: { onCloseModal: () => void } };
    ref?.current?.onCloseModal();
  };

  const onEventDismiss = () => {
    setEventProducerModal(false)
    const ref = modalRef as { current: { onCloseModal: () => void } };
  }


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
    <ModalComponent viewStyle={styles.modalContainer} ref={modalRef}>
      <View style={styles.optionsView}>
        {isShowPaymentCheck ? (
          <>{renderView(strings.event, eventBlack, true)}</>
        ) : (
          <></>
        )}

        <View style={styles.row}>
          {renderViewOffer(strings.offer, offer, true, styles.greenView)}
          {renderViewRequest(strings.request, request, true, styles.greenView)}
          {renderViewGratitude(
            strings.gratitude,
            gratitudeBlack,
            true,
            styles.greenView
          )}
        </View>
      </View>
      {/* <Modal transparent visible={iseventProducerModal} onDismiss={onEventDismiss}>
        <GestureRecognizer
          onSwipeDown={onEventDismiss} style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={onEventDismiss}
          />
        </GestureRecognizer>
        <TouchableOpacity activeOpacity={1} style={styles.modalMainContainer}>
          <TouchableOpacity style={styles.titleContainer} activeOpacity={0.8}>
            <ImageComponent source={eventWhite} style={styles.iconEvent} />
            <Text style={styles.label}>{strings.eventProducer}</Text>
          </TouchableOpacity>

          <Text style={styles.playerDescription}>{strings.eventDes}</Text>

          <Subscription
            label={strings.signUp}
            pillStyle={styles.signUpStyle}
            backgroundColor="#DB9791"
            onPressPill={() => onEventProducer()}
          />
        </TouchableOpacity>
      </Modal> */}
    </ModalComponent>
  );
};
