/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useCallback, useState} from 'react';
import {createStyleSheet} from './style';
import {ModalComponent, ModalRefProps} from '@components/modal-component';
import {
  Alert,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageComponent} from '@components/image-component';
import {eventBlack, gratitudeBlack, offer, request} from '@assets/images';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {navigations} from '@config/app-navigation/constant';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {UserProfileState} from '@network/reducers/user-profile-reducer';
import {useUserProfile} from '@network/hooks/user-service-hooks/use-user-profile';

interface AddComponentModalProps {
  modalRef?: React.Ref<ModalRefProps>;
  navigation: NavigationContainerRef<ParamListBase>;
}

export const AddComponentModal = (props: AddComponentModalProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const [isActiveSubs, setIsActiveSubs] = useState(false);
  const {modalRef, navigation} = props || {};
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {user_type: string; id: string}};

  const {data, refetch} = useUserProfile({
    userId: user?.id,
  });
  const {isActiveSubscription} = data || {};

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user]),
  );

  useFocusEffect(
    useCallback(() => {
      setIsActiveSubs(isActiveSubscription);
    }, [isActiveSubscription]),
  );

  const onNavigate = () => {
    if (user?.user_type === 'eventProducer' && isActiveSubs) {
      navigation?.navigate(navigations.ADMIN_TOOLS, {isCreateEvent: true});
    } else {
      Alert.alert('', strings.purchaseSubscription);
    }
    const ref = modalRef as {current: {onCloseModal: () => void}};
    ref?.current?.onCloseModal();
  };

  const renderView = (
    name: string,
    icon: number,
    enable: boolean,
    style?: StyleProp<ViewStyle>,
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!enable}
        onPress={onNavigate}
        style={[styles.view, style]}>
        <ImageComponent source={icon} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ModalComponent viewStyle={styles.modalContainer} ref={modalRef}>
      <View style={styles.optionsView}>
        {renderView(strings.event, eventBlack, true)}
        <View style={styles.row}>
          {renderView(strings.offer, offer, false, styles.greenView)}
          {renderView(strings.request, request, false, styles.greenView)}
          {renderView(
            strings.gratitude,
            gratitudeBlack,
            false,
            styles.greenView,
          )}
        </View>
      </View>
    </ModalComponent>
  );
};
