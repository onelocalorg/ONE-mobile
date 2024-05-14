/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { calendarTime, copy, pinWhite, startImg } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { ModalRefProps } from "~/components/modal-component";
import { Navbar } from "~/components/navbar/Navbar";
import { SizedBox } from "~/components/sized-box";
import { navigations } from "~/config/app-navigation/constant";
import { PurchaseProps } from "~/network/api/services/home-service";
import { getData } from "~/network/constant";
import { useEventDetails } from "~/network/hooks/home-service-hooks/use-event-details";
import { usePurchaseTicket } from "~/network/hooks/home-service-hooks/use-purchase-ticket";
import { useCreatePayoutIntent } from "~/network/hooks/payment-service-hooks/use-create-payout-intent";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { verticalScale } from "~/theme/device/normalize";
import { LocalEventData } from "~/types/local-event-data";
import Going from "../../assets/images/going.png";
import { createStyleSheet } from "./style";
import { TicketCheckoutModal } from "./ticket-checkout-modal";

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
  const [Loading, LodingData] = useState(false);
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [ProfileData, setUserProfile]: any = useState("");
  const [showLoader, LoadingData] = useState(false);
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
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
    end_date,
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

  console.log(id, "-------------id-------------");
  const { mutateAsync: createPayoutIntent } = useCreatePayoutIntent();
  const { mutateAsync: purchaseTicket, isLoading: purchaseTicketLoading } =
    usePurchaseTicket();
  const [searchQuery, setSearchQuery] = useState("");
  const isShowPaymentCheck = getData("isShowPaymentFlow");
  const [issLoading, setLoading] = useState(true);

  //fetching rsvps
  useEffect(() => {
    fetchRsvpDataAPI();
  }, [id]);

  const fetchRsvpDataAPI = async () => {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.API_URL}/v1/events/rsvp/${id}`,
        {
          headers: {
            method: "get",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRsvpData(data);
        findItemById(data);
        LodingData(false);
        console.log(
          JSON.stringify(data),
          "--------------fetchRsvpData---------------"
        );
      } else {
        console.error("Failed to fetch RSVP data");
      }
    } catch (error) {
      console.error("Error fetching RSVP data:", error);
    }
  };

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
      return isShowPaymentCheck;
    } else {
      const isShowPaymentCheckAndroid = getData("isShowPaymentFlowAndroid");
      return isShowPaymentCheckAndroid;
    }
  };

  async function eventViewAPI() {
    // LodingData(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(
        process.env.API_URL + "/v1/events/event-count/" + id,
        // process.env.API_URL + '/v1/events/event-count/6565af618267f45414608d66',
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

  //----------------rsvpFilterAPI--------------------
  async function rsvpFilterAPI(type: any) {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");

    console.log(type, "-----------type-----------");
    try {
      const response = await fetch(
        `${process.env.API_URL}/v1/events/rsvp/${id}`,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ type: type }),
        }
      );
      const isDataItem = await response.json();
      Toast.show(isDataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      if (response.ok) {
        fetchRsvpDataAPI();
        console.log("rsvp................", type);
        LodingData(false);
      } else {
        console.error("Error fetching RSVP data:");
      }
    } catch (error) {
      console.error("Error while making RSVP:", error);
    }
  }

  const onBuyTicket = () => {
    if (isTicketAvailable) {
      modalRef.current?.onOpenModal();
    } else {
      Alert.alert("", strings.noTicketsAvailable);
    }
  };

  const handleEditEvent = () => {
    navigation?.navigate(navigations.ADMIN_TOOLS, { eventData: data });
  };

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userProfileId");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/" + userId,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
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
    console.log("1111dedede");
    if (price === 0) {
      onPaymentSuccess(
        cardData,
        ticketId,
        ticketName,
        price.toString(),
        quantityticket
      );
    } else {
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

  const rsvpsFilter = (type: any) => {
    if (type == selectedButton) {
      setSelectedButton(null);
    } else {
      setSelectedButton(type);
    }
    if (type == "interested" || type == "going") {
      console.log("---------type-------------------");
      rsvpFilterAPI(type);
    }
  };

  const findItemById = (rsvpDatas: any) => {
    const foundItem: any = rsvpDatas?.data?.rsvps.find(
      (item: any) => item?.user_id?.id === user?.id
    );
    console.log(foundItem, "-------------user list-------------");
    if (foundItem) {
      setSelectedButton(foundItem?.rsvp);
    } else {
      setSelectedButton(null);
    }
  };

  return (
    <View>
      <Loader
        visible={isLoading || isRefetching || purchaseTicketLoading || Loading}
        showOverlay
      />
      <Navbar navigation={props.navigation} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>{name}</Text>
          <SizedBox height={verticalScale(16)} />
          <View style={{ position: "relative" }}>
            <Image
              resizeMode="cover"
              source={
                event_image
                  ? { uri: event_image }
                  : require("~/assets/images/defaultEvent.png")
              }
              style={styles.eventImage}
            />

            {/* <View style={{position:'absolute',bottom:-10,width:165,height:34,backgroundColor:'#DA9791',alignSelf:'center',borderRadius:7,justifyContent:'center'}}>
              <TouchableOpacity style={{width:46,height:15,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>hello</Text>
              </TouchableOpacity>
            </View> */}
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
          {tickets?.length ? (
            <Text style={styles.event}>{strings.tickets}</Text>
          ) : (
            <></>
          )}
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

          <View style={styles1.container2}>
            <TouchableOpacity
              style={[
                styles1.button,
                selectedButton === "going" && styles1.selectedButton,
                isCurrentUserRSVP("going") && { backgroundColor: "#E9B9B4" },
              ]}
              onPress={() => rsvpsFilter("going")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={styles1.buttonText}>Going</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles1.button,
                selectedButton === "interested" && styles1.selectedButton,
                isCurrentUserRSVP("interested") && {
                  backgroundColor: "#E9B9B4",
                },
              ]}
              onPress={() => rsvpsFilter("interested")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={styles1.buttonText}>Maybe</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles1.button, { backgroundColor: "#E9B9B4" }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={styles1.buttonText}>Invite</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
              justifyContent: "space-between",
              gap: 100,
            }}
          >
            <Text style={{ fontSize: 20, color: "black", fontWeight: "600" }}>
              RSVPs
            </Text>

            <View style={{ flexDirection: "row", columnGap: 20 }}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  {rsvpData?.data?.going}
                </Text>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  Going
                </Text>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  {rsvpData?.data?.interested}
                </Text>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "600" }}
                >
                  Maybe
                </Text>
              </View>
            </View>
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
                        <Image source={startImg} style={styles1.rsvpImage} />
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
            <ButtonComponent
              title={strings.adminTools}
              onPress={handleEditEvent}
            />
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      <TicketCheckoutModal
        eventData={data as LocalEventData}
        onPurchase={onPurchaseTicketThroughCard}
        ref={modalRef}
        loader={showLoader}
      />
    </View>
  );
};
const styles1 = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 300,
    height: 50,
    marginTop: 20,
    backgroundColor: "#DA9791",
    alignSelf: "center",
    borderRadius: 20,
    gap: 30,
  },
  button: {
    backgroundColor: "#E9B9B4",
    width: 65,
    height: 30,
    marginVertical: 10,
    borderRadius: 10,
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
    borderColor: "green",
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
