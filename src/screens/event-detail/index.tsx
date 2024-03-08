/* eslint-disable react-hooks/exhaustive-deps */
import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import {
  Alert,
  LogBox,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "@components/header";
import { ImageComponent } from "@components/image-component";
import {
  Search,
  arrowLeft,
  calendarTime,
  copy,
  dummy,
  onelogo,
  pinWhite,
} from "@assets/images";
import { SizedBox } from "@components/sized-box";
import { verticalScale } from "@theme/device/normalize";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { ButtonComponent } from "@components/button-component";
import { ModalRefProps } from "@components/modal-component";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { TicketCheckoutModal } from "./ticket-checkout-modal";
import { navigations } from "@config/app-navigation/constant";
import { Result } from "@network/hooks/home-service-hooks/use-event-lists";
import moment from "moment";
import { useEventDetails } from "@network/hooks/home-service-hooks/use-event-details";
import { Loader } from "@components/loader";
import { useCreatePayoutIntent } from "@network/hooks/payment-service-hooks/use-create-payout-intent";
import { useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import { UserProfileState } from "@network/reducers/user-profile-reducer";
import { usePurchaseTicket } from "@network/hooks/home-service-hooks/use-purchase-ticket";
import { PurchaseProps } from "@network/api/services/home-service";
import { formatPrice } from "@utils/common";
import Clipboard from "@react-native-clipboard/clipboard";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { API_URL } from "@network/constant";

interface EventDetailScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

export const EventDetailScreen = (props: EventDetailScreenProps) => {
  const { theme } = useAppTheme();
  const routeee = useRoute();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const { id } = route?.params ?? {};
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [ProfileData, setUserProfile]: any = useState("");
  const [showLoader, LoadingData] = useState(false);
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { stripeCustomerId: string; user_type: string } };
  const { refetch, isLoading, isRefetching, data } = useEventDetails({
    eventId: id ?? "",
  });
  const {
    about,
    address,
    start_date,
    is_event_owner,
    full_address,
    name,
    eventProducer,
    event_image,
    start_date_label,
    start_time_label,
    tickets,
    cancelled,
    //   isPayout,
    // viewCount
  } = data || {};

  const { mutateAsync: createPayoutIntent } = useCreatePayoutIntent();
  const { mutateAsync: purchaseTicket, isLoading: purchaseTicketLoading } =
    usePurchaseTicket();
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      console.log("route Name-------------", routeee.name);
      const ticketLength = tickets?.filter(
        (ele) => !ele?.is_ticket_purchased
      )?.length;
      LogBox.ignoreAllLogs();
      if (ticketLength > 0) {
        setIsTicketAvailable(true);
      } else {
        setIsTicketAvailable(false);
      }
    }, [data])
  );

  useFocusEffect(
    useCallback(() => {
      getUserProfileAPI();
      eventViewAPI();
      refetch();
    }, [])
  );

  async function eventViewAPI() {
    // LodingData(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(
        API_URL + "/v1/events/event-count/" + id,
        // API_URL + '/v1/events/event-count/6565af618267f45414608d66',
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );

      const dataItem = await response.json();
      // LodingData(false);
      console.log("=========== eventViewAPI response==============");
      console.log(dataItem);
    } catch (error) {
      console.error(error);
      // LodingData(false);
    }
  }

  const onBuyTicket = () => {
    if (is_event_owner) {
      navigation?.navigate(navigations.ADMIN_TOOLS, { eventData: data });
    } else if (isTicketAvailable) {
      modalRef.current?.onOpenModal();
    } else {
      Alert.alert("", strings.noTicketsAvailable);
    }
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userProfileId");
    console.log("token", token);
    try {
      const response = await fetch(API_URL + "/v1/users/" + userId, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      console.log("-----------------Response User Profile API------------");
      console.log(dataItem);
      console.log(dataItem.data.pic);
      setUserProfile(dataItem.data);
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  const onPaymentSuccess = async (
    paymentData: PurchaseProps,
    ticketId: string,
    ticketName: string,
    ticketPrice: string,
    quantityticket: number
  ) => {
    const request = {
      bodyParams: {
        stripeResponse: paymentData,
        eventId: id ?? "",
        ticketId: ticketId,
        ticketName: ticketName,
        ticketPrice: ticketPrice,
        ticket_quantity: quantityticket,
      },
    };
    LoadingData(true);
    console.log(request, "1111111111");
    const res = await purchaseTicket(request);
    if (res?.success === true) {
      Toast.show(res.message, Toast.LONG, {
        backgroundColor: "black",
      });
      LoadingData(false);
      navigation?.goBack();
    } else {
      LoadingData(false);
    }
  };

  const onPurchaseTicketThroughCard = async (
    cardData: any,
    ticketId: string,
    ticketName: string,
    price: any,
    quantityticket: number
  ) => {
    onPaymentSuccess(
      cardData,
      ticketId,
      ticketName,
      `${parseFloat(price?.replace("USD", ""))}`,
      quantityticket
    );
  };

  const onPurchaseTicket = async (
    price: any,
    ticketId: string,
    ticketName: string,
    quantityticket: number
  ) => {
    const unique_Id = await AsyncStorage.getItem("uniqueId");
    var Payment: any = {
      ticketId: ticketId,
      purchase_user_unique_id: unique_Id,
      purchased_ticket_qunatity: quantityticket,
    };
    const request = {
      amount: price * 100,
      currency: "usd",
      "automatic_payment_methods[enabled]": true,
      customer: user?.stripeCustomerId,
      description: "Payment-Mobile",
      metadata: Payment,
    };
    console.log("------------onPurchaseTicket-----------------");
    let clientSecret = "";
    const res = await createPayoutIntent({ bodyParams: request });
    if (res?.statusCode === 200) {
      clientSecret = res?.data?.client_secret;
    }
    console.log("-------------------clientSecret---------------", res);
    modalRef.current?.onCloseModal();
    navigation?.navigate(navigations.PAYMENT, {
      clientSecret,
      paymentData: res?.data,
      onSuccess: () =>
        onPaymentSuccess(
          res?.data,
          ticketId,
          ticketName,
          `${parseFloat(price?.replace("USD", ""))}`,
          quantityticket
        ),
    });
  };

  const getDate = (date = new Date().toString()) => {
    return `${moment(date).format("ddd, MMM DD • hh:mm A")}`;
  };

  const copyPaymentLink = (link: string) => {
    Clipboard.setString(link);
    Alert.alert("Message", strings.linkCopied);
  };

  const onNavigateToProducerProfile = () => {
    if (is_event_owner) {
      navigation?.navigate(navigations.PROFILE);
    } else {
      AsyncStorage.setItem("recentUserId", eventProducer?.id);
      navigation?.navigate(navigations.RECENTUSERPROFILE);
    }
  };

  const onNavigateToProfile = () => {
    navigation?.navigate(navigations.PROFILE);
  };

  return (
    <View>
      <Loader
        visible={isLoading || isRefetching || purchaseTicketLoading}
        showOverlay
      />
      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity onPress={onBackPress} style={{ zIndex: 11111222222 }}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        {/* <View style={styles.searchContainer}>
          <ImageComponent style={styles.searchIcon} source={Search}></ImageComponent>
          <TextInput value={searchQuery} placeholderTextColor="#FFFF" placeholder='Search' style={styles.searchInput} onChangeText={value => {
            console.log(value)
            setSearchQuery(value)
          }}></TextInput>
        </View> */}

        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}
          ></ImageComponent>
          <View>
            <Text style={styles.oneContainerText}>NE</Text>
            <Text style={styles.localText}>L o c a l</Text>
          </View>
        </View>
        <View style={styles.profileContainer}>
          {/* <ImageComponent
            style={styles.bellIcon}
            source={bell}></ImageComponent> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}
          >
            <ImageComponent
              resizeMode="cover"
              isUrl={!!ProfileData?.pic}
              source={dummy}
              uri={ProfileData?.pic}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>{name}</Text>
          <SizedBox height={verticalScale(16)} />
          <ImageComponent
            resizeMode="cover"
            uri={event_image}
            isUrl
            style={styles.eventImage}
          />
          <SizedBox height={verticalScale(16)} />
          <View style={styles.row}>
            <View style={styles.circularView}>
              <ImageComponent
                source={calendarTime}
                style={styles.calendarTime}
              />
            </View>
            <View style={styles.margin}>
              <Text style={styles.date}>{start_date_label}</Text>
              <Text style={styles.time}>{start_time_label}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.marginTop]}>
            <View style={[styles.circularView, styles.yellow]}>
              <ImageComponent source={pinWhite} style={styles.pinWhite} />
            </View>
            <View style={styles.margin}>
              <Text style={styles.date}>{address}</Text>
              <Text style={styles.time}>{full_address}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.marginTop]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToProducerProfile}
            >
              <ImageComponent
                resizeMode="cover"
                source={{ uri: eventProducer?.pic }}
                style={styles.dummy}
              />
            </TouchableOpacity>
            <View style={styles.margin}>
              <Text
                style={styles.date}
              >{`${eventProducer?.first_name} ${eventProducer?.last_name}`}</Text>
              <Text style={styles.time}>
                {user?.user_type === "player"
                  ? strings.player
                  : strings.producer}
              </Text>
            </View>
          </View>
        </View>

        <SizedBox height={verticalScale(16)} />
        <View style={styles.container}>
          <Text style={styles.event}>{strings.tickets}</Text>
          <View>
            {tickets?.map((ele) => (
              <View key={ele?.price.toString()} style={styles.rowOnly}>
                <Text
                  style={styles.ticket}
                >{`$${ele?.price} - ${ele?.name}`}</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyPaymentLink(ele?.ticket_purchase_link ?? "")
                  }
                  activeOpacity={0.8}
                >
                  <ImageComponent source={copy} style={styles.copy} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {!is_event_owner ? (
            <ButtonComponent
              disabled={cancelled}
              title={strings.buyTicket}
              onPress={onBuyTicket}
            />
          ) : (
            <></>
          )}

          <SizedBox height={verticalScale(20)} />
          <Text style={styles.event}>{strings.aboutEvent}</Text>
          <Text style={styles.desc}>{about}</Text>

          
          {is_event_owner ? (
            <ButtonComponent
              disabled={cancelled}
              title={strings.adminTools}
              onPress={onBuyTicket}
            />
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      <TicketCheckoutModal
        eventData={data as Result}
        onPurchase={onPurchaseTicketThroughCard}
        ref={modalRef}
        loader={showLoader}
      />
    </View>
  );
};
