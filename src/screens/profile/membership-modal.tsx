import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {forwardRef, useState} from 'react';
import {createStyleSheet} from './style';
import {ModalComponent} from '@components/modal-component';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Pill} from '@components/pill';
import {bucket} from '@assets/images';
import {ButtonComponent} from '@components/button-component';
import {useCreateSubscription} from '@network/hooks/payment-service-hooks/use-create-subscription';
import {Loader} from '@components/loader';
import {useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {UserProfileState} from '@network/reducers/user-profile-reducer';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import {navigations} from '@config/app-navigation/constant';
import {stripeSuccessUrl} from '@assets/constants';
import {useSubscriptionPlans} from '@network/hooks/home-service-hooks/use-subscription-plans';

interface MembershipModalProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

const MembershipModalComp = (
  props: MembershipModalProps,
  ref: React.Ref<unknown> | undefined,
) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {navigation} = props ?? {};
  const [isBilledMonthly, setIsBilledMonthly] = useState(true);
  const {mutateAsync: createSubscription, isLoading} = useCreateSubscription();
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {stripeCustomerId: string; id: string}};
  const {data} = useSubscriptionPlans();
  const monthlyPlan = data?.[0];
  const yearlyPlan = data?.[1];

  const handleBillingSubscription = (value: boolean) => {
    setIsBilledMonthly(value);
  };

  const onPurchaseSubscription = async () => {
    if (data) {
      const request = {
        bodyParams: {
          success_url: 'https://example.com/success',
          mode: 'subscription',
          customer: user?.stripeCustomerId,
          'line_items[0][price]': isBilledMonthly
            ? monthlyPlan?.price_id
            : yearlyPlan?.price_id,
          'line_items[0][quantity]': 1,
        },
      };
      const res = await createSubscription(request);
      if (res?.statusCode === 200) {
        const modalRef = ref as {current: {onCloseModal: () => void}};
        modalRef?.current?.onCloseModal();
        const {url} = res?.data ?? {};
        navigation.navigate(navigations.GENERIC_WEB_VIEW, {
          uri: url,
          onUrlChange: onUrlChange,
        });
      }
    } else {
      Alert.alert('Error', 'No Plan available');
    }
  };

  const onUrlChange = (url: string) => {
    if (url === stripeSuccessUrl) {
      navigation.goBack();
    }
  };

  return (
    <ModalComponent ref={ref} title={strings.membershipCheckout}>
      <Loader visible={isLoading} showOverlay />
      <View style={styles.modalContainer}>
        <Pill
          icon={bucket}
          label={strings.productMerchant}
          pillStyle={styles.pillStyle}
          backgroundColor={theme.colors.lightPurple}
        />
        <View style={styles.selectContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.selectView,
              isBilledMonthly && styles.selectedSelectView,
            ]}
            onPress={() => handleBillingSubscription(true)}>
            <Text style={styles.amount}>
              {`$${parseInt(monthlyPlan?.price?.$numberDecimal, 10)}`}
            </Text>
            <Text style={styles.bill}>{monthlyPlan?.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.selectView,
              !isBilledMonthly && styles.selectedSelectView,
            ]}
            onPress={() => handleBillingSubscription(false)}>
            <Text style={styles.amount}>{`$${parseInt(
              yearlyPlan?.price?.$numberDecimal,
              10,
            )}`}</Text>
            <Text style={styles.bill}>{yearlyPlan?.name}</Text>
          </TouchableOpacity>
        </View>
        {(isBilledMonthly
          ? !monthlyPlan?.is_active_subscription
          : !yearlyPlan?.is_active_subscription) && (
          <View style={styles.button}>
            <ButtonComponent
              onPress={onPurchaseSubscription}
              title={strings.purchase}
            />
          </View>
        )}
      </View>
    </ModalComponent>
  );
};

export const MembershipModal = forwardRef(MembershipModalComp);
