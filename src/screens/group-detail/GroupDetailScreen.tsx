/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { dummy } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useChapterService } from "~/network/api/services/useChapterService";
import { useGroupService } from "~/network/api/services/useGroupService";
import { PostsList } from "../home/PostsList";
import { MyEvents } from "../myprofile/MyEvents";
import { AboutGroup } from "./AboutGroup";
import { createStyleSheet } from "./style";

export const GroupDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.GROUP_DETAIL>) => {
  const groupId = route.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [selectedTab, setSelectedTab] = useState(0);
  const { gotoEditGroup } = useNavigations();
  const myId = useMyUserId();

  const {
    queries: { detail: getGroup },
  } = useGroupService();

  const { isPending, data: group } = useQuery(getGroup(groupId));
  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: chapters } = useQuery(listChapters());

  return (
    <>
      <Loader visible={isPending} />
      <View style={styles.container}>
        {group ? (
          <>
            <View style={styles.rowOnly}>
              <ImageComponent
                isUrl={!!_.head(group.images)?.url}
                resizeMode="cover"
                uri={_.head(group.images)?.url}
                source={dummy}
                style={styles.profile}
              />
              <View style={styles.fullName}>
                <View style={styles.rowOnly}>
                  <Text style={styles.name}>{group.name} </Text>
                </View>
                <Text style={styles.des}>{group.summary}</Text>
              </View>
            </View>

            {group.admins.find((a) => a.id === myId) && (
              <ButtonComponent
                title="Edit"
                onPress={() => gotoEditGroup(groupId)}
              />
            )}

            <View style={styles.line} />
            <TabComponent
              tabs={[
                strings.about,
                strings.posts,
                strings.events,
                strings.groups,
              ]}
              onPressTab={setSelectedTab}
            />
            {navigation ? (
              <>
                {selectedTab === 0 && <AboutGroup group={group} />}
                {selectedTab === 1 && <PostsList group={group} />}
                {selectedTab === 2 && <MyEvents group={group} />}
              </>
            ) : null}

            {/* <ScrollView showsVerticalScrollIndicator={false}>
            {selectedTab === 0 && <Recentabout group={group} />}
            {selectedTab === 1 && userId ? (
              <RecentMyEvents userId={userId} navigation={navigation} />
            ) : null}
          </ScrollView> */}
          </>
        ) : null}
      </View>
    </>
  );
};
