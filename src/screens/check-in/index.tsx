/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ListRenderItem, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { FlatListComponent } from "~/components/flatlist-component";
import { Loader } from "~/components/loader";

import { Pill } from "~/components/pill";

import { useCheckedInUser } from "~/network/hooks/home-service-hooks/use-checked-in-user";
import {
  Result,
  useTicketHolderCheckinsList,
} from "~/network/hooks/home-service-hooks/use-ticket-holder-checkin-list";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { CheckInList } from "./check-in-list";
import { createStyleSheet } from "./style";

interface CheckInScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      eventId: string;
    };
  };
}

export const CheckInScreen = (props: CheckInScreenProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const { eventId } = route?.params ?? {};
  const styles = createStyleSheet(theme);
  const [totalPages, setTotalPages] = useState(0);
  const [checkInList, setCheckInList] = useState<Result[]>([]);
  const [page, setPage] = useState(1);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string } };
  const { isLoading, isRefetching, refetch } = useTicketHolderCheckinsList({
    queryParams: { limit: 10, page },
    eventId,
  });
  const { mutateAsync, isLoading: checkedInLoading } = useCheckedInUser();
  const [searchQuery, setSearchQuery] = useState("");

  const onCheckInUser = async (id: string, index: number, data: Result) => {
    const request = {
      isCheckedIn: true,
      is_app_user: data?.is_app_user,
      email: data?.user?.email,
    };

    await mutateAsync({ bodyParams: request, checkInUserId: id });
    const tickeHolderCopy = [...checkInList];

    const selectedTickeHolder = tickeHolderCopy.filter(
      (ele) => ele?._id === id
    )?.[0];
    selectedTickeHolder.isCheckedIn = true;
    tickeHolderCopy.splice(index, 1, selectedTickeHolder);

    setCheckInList(tickeHolderCopy);
  };

  useEffect(() => {
    getTicketHolderCheckInList();
  }, [page]);

  const getTicketHolderCheckInList = async () => {
    const res = await refetch();

    setCheckInList((prevData) => [
      ...prevData,
      ...(res?.data?.data?.results || []),
    ]);
    setTotalPages(res?.data?.data?.totalPages);
  };

  const onLoadMoreData = () => {
    setPage(page + 1);
  };

  const renderItem: ListRenderItem<Result> = ({ item, index }) => (
    <CheckInList
      onCheckInUser={(id: string) => onCheckInUser(id, index, item)}
      key={item?._id.toString()}
      data={item}
    />
  );

  const onBackPress = () => {
    navigation?.goBack();
  };

  return (
    <View>
      <Loader
        visible={
          (page === 1 && (isLoading || isRefetching)) || checkedInLoading
        }
        showOverlay={true}
      />

      <View style={styles.pillContainer}>
        <Pill
          label={strings.ticketholderCheckin}
          backgroundColor={theme.colors.white}
          foreGroundColor={theme.colors.black}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.heading}>{checkInList?.[0]?.event?.name}</Text>
        <FlatListComponent
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          data={checkInList}
          onLoadMoreData={onLoadMoreData}
          emptyComponentData={{ title: strings.noCheckedInUserFound }}
          totalPages={totalPages}
          currentPage={page}
          dataLength={checkInList.length}
          enablePagination
          contentContainerStyle={styles.scrollView}
        />
      </View>
    </View>
  );
};
