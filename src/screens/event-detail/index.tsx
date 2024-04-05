/* eslint-disable react-hooks/exhaustive-deps */
import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { createStyleSheet } from "./style";
import {
  Alert,
  LogBox,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
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
import Going from "../../assets/images/going.png";
import Cantgo from "../../assets/images/canntgo.png";
import Maybe from "../../assets/images/maybe.png";
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
import { API_URL, getData } from "@network/constant";

interface EventDetailScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

interface RSVP {
  _id: string;
  rsvp: string;
  user_id: {
    first_name: string;
    last_name: string;
    pic: string;
    id: string;
  };
}

interface RsvpData {
  success: boolean;
  code: number;
  message: string;
  data: {
    rsvps: RSVP[];
    going: number;
    interested: number;
    cantgo: number;
  };
}

interface User {
  id: string;
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
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { stripeCustomerId: string; user_type: string; id: string } };
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
  const isShowPaymentCheck = getData("isShowPaymentFlow");
  const [issLoading, setLoading] = useState(true);

  //fetching rsvps
  useEffect(() => {
    const fetchRsvpData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/v1/events/rsvp/${id}`, {
          headers: {
            method: "get",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRsvpData(data);
        } else {
          console.error("Failed to fetch RSVP data");
        }
      } catch (error) {
        console.error("Error fetching RSVP data:", error);
      }
    };

    fetchRsvpData();
  }, [id]);


  useFocusEffect(
    useCallback(() => {
      console.log("user........................", user);

      const ticketLength = tickets?.filter(
        (ele) => !ele?.is_ticket_purchased
      )?.length;
      console.log("isticket..............", ticketLength);
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


  const onCheckReleaseHideShow = () => {
    if (Platform.OS === "ios") {
      const isShowPaymentCheck = getData("isShowPaymentFlow");
      return isShowPaymentCheck
    } else{
      const isShowPaymentCheckAndroid = getData("isShowPaymentFlowAndroid");
      return isShowPaymentCheckAndroid
    }
  };

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
      console.log("id....................", response);
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
    try {
      const response = await fetch(API_URL + "/v1/users/" + userId, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
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
    const res = await purchaseTicket(request);
    if (res?.success === true) {
      Toast.show(res.message, Toast.LONG, {
        backgroundColor: "black",
      });
      //sending rsvp type  to server
      let rsvp = "";
      if (selectedButton === 1) {
        rsvp = "going";
      } else if (selectedButton === 2) {
        rsvp = "interested";
      } else {
        rsvp = "cantgo";
      }
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/v1/events/rsvp/${id}`, {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ type: rsvp }),
        });
        if (response.ok) {
          console.log("rsvp................", rsvp);
          Alert.alert("Payment Succeed");
        } else {
          Alert.alert("failed");
        }
      } catch (error) {
        console.error("Error while making RSVP:", error);
      }
      // End of RSVP API call
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
    console.log('1111dedede')
    if(price === 0){
      onPaymentSuccess(
        cardData,
        ticketId,
        ticketName,
        price.toString(),
        quantityticket
      );
    } else{
      onPaymentSuccess(
        cardData,
        ticketId,
        ticketName,
        `${parseFloat(price?.replace("USD", ""))}`,
        quantityticket
      );
    }
   
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

  // Check if the logged-in user's ID is available in RSVP data
  const isCurrentUserRSVP = (type: string) => {
    if (rsvpData && rsvpData.data && rsvpData.data.rsvps) {
      const currentUserRSVP = rsvpData.data.rsvps.find(
        (rsvp) => rsvp.user_id.id === user?.id
      );
      return currentUserRSVP && currentUserRSVP.rsvp === type;
    }
    return false;
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
          <View style={{ position: "relative" }}>
            <ImageComponent
              resizeMode="cover"
              uri={event_image}
              isUrl
              style={styles.eventImage}
            />

            {/* <View style={{position:'absolute',bottom:-10,width:165,height:34,backgroundColor:'#DA9791',alignSelf:'center',borderRadius:7,justifyContent:'center'}}>
              <TouchableOpacity style={{width:46,height:15,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>hello</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles1.container2}>
              <TouchableOpacity
                style={[
                  styles1.button,
                  selectedButton === 1 && styles1.selectedButton,
                  isCurrentUserRSVP("going") && { backgroundColor: "#E9B9B4" },
                ]}
                onPress={() => setSelectedButton(1)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={styles1.buttonText}>Going</Text>
                  {isCurrentUserRSVP("going") && (
                    <Image
                      source={require("../../assets/images/confirmedTicket.png")}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles1.button,
                  selectedButton === 2 && styles1.selectedButton,
                  isCurrentUserRSVP("interested") && {
                    backgroundColor: "#E9B9B4",
                  },
                ]}
                onPress={() => setSelectedButton(2)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={styles1.buttonText}>Maybe</Text>
                  {isCurrentUserRSVP("interested") && (
                    <Image
                      source={require("../../assets/images/confirmedTicket.png")}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <SizedBox height={verticalScale(35)} />
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
        {tickets?.length ? 
          <Text style={styles.event}>{strings.tickets}</Text> : <></>}
          <View>
            {tickets?.map((ele) => (
              <View key={ele?.price.toString()} style={styles.rowOnly}>
                <Text
                  style={styles.ticket}
                >{`$${ele?.price} - ${ele?.name}`}</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyPaymentLink(ele?.ticket_purchase_link ?? "  ")
                  }
                  activeOpacity={0.8}
                >
                  <ImageComponent source={copy} style={styles.copy} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {onCheckReleaseHideShow() ? (
            <>
              {!is_event_owner && tickets?.length ? (
                <ButtonComponent
                  disabled={cancelled}
                  title={strings.buyTicket}
                  onPress={onBuyTicket}
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
              justifyContent: "flex-start",
              gap: 100,
            }}
          >
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              RSVPS
            </Text>
            {rsvpData && rsvpData.data && rsvpData.data.rsvps ? (
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  {
                    rsvpData.data.rsvps.filter((rsvp) => rsvp.rsvp === "going")
                      .length
                  }
                </Text>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  Going
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
                No RSVP data available
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
              marginTop: "8%",
              width: "100%",
            }}
          >
            {rsvpData && rsvpData.data && rsvpData.data.rsvps ? (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  gap: 5,
                  width: "100%",
                }}
              >
                {rsvpData.data.rsvps.map((rsvp, index) => (
                  <View key={index} style={styles1.rsvpContainer}>
                    <View style={styles1.profilePicContainer}>
                      <Image
                        source={{ uri: rsvp.user_id.pic }}
                        style={styles1.profilePic}
                      />
                    </View>
                    <View style={styles1.rsvpImageContainer}>
                      {rsvp.rsvp === "going" && (
                        <Image source={Going} style={styles1.rsvpImage} />
                      )}
                      {rsvp.rsvp === "interested" && (
                        <Image source={Maybe} style={styles1.rsvpImage} />
                      )}
                      {rsvp.rsvp === "cantgo" && (
                        <Image source={Cantgo} style={styles1.rsvpImage} />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text>No RSVP data available</Text>
            )}
          </View>

          <SizedBox height={verticalScale(30)} />
          <Text style={styles.event}>{strings.aboutEvent}</Text>
          <Text style={styles.desc}>{about}</Text>

          {is_event_owner ? (
            <ButtonComponent title={strings.adminTools} onPress={onBuyTicket} />
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
const styles1 = StyleSheet.create({
  container2: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 190,
    height: 34,
    position: "absolute",
    bottom: -15,
    backgroundColor: "#DA9791",
    alignSelf: "center",
    borderRadius: 20,
    gap: 30,
  },
  button: {
    backgroundColor: "#E9B9B4",
    width: 66,
    height: 20,
    marginVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "400",
    fontFamily: "NotoSerif-Regular",
  },
  selectedButton: {
    borderColor: "red",
    borderWidth: 2,
  },
  rsvpContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  profilePicContainer: {
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  rsvpImageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  rsvpImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
});
