import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "~/components/chapter-list-searchable/style";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useChapterService } from "~/network/api/services/useChapterService";
import { Chapter } from "~/types/chapter";

export const ChapterListSearchable = ({
  route,
}: RootStackScreenProps<Screens.SELECT_CHAPTERS>) => {
  const { chapters } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [searchText, setSearchText] = useState("");
  const [selectedChapters, setSelectedChapters] = useState(chapters || []);
  const navigation = useNavigation();

  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: allChapters } = useQuery(
    listChapters({
      search: searchText,
    })
  );

  const separatedChapters = allChapters
    ? Object.entries(
        _.groupBy((chapter: Chapter) => chapter.name.charAt(0), allChapters)
      ).sort()
    : [];

  const toggleSelectChapter = (chapter: Chapter) => {
    let selectedNow;
    if (selectedChapters.find((u) => u.id === chapter.id)) {
      selectedNow = selectedChapters.filter((u) => u.id !== chapter.id);
    } else {
      selectedNow = [...selectedChapters, chapter];
    }
    setSelectedChapters(selectedNow);

    navigation.setParams({
      chapters: selectedNow,
    });
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          size={20}
          color={theme.colors.lightGray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          placeholder="Search name"
          placeholderTextColor={theme.colors.lightGray}
        />
      </View>
      <SectionList
        style={styles.container}
        sections={separatedChapters.map(([key, value]) => ({
          title: key,
          data: value,
        }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleSelectChapter(item)}>
            <View style={styles.chapterDetailsCont}>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {/* <View style={styles.detailsSubCont}>
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.chapterImage}
                      isUrl={!!item?.pic}
                      uri={item?.pic}
                      source={defaultChapter}
                    />
                  </View> */}
                  <Text style={styles.chapternameLbl}>{item.name}</Text>
                </View>
                {selectedChapters.find((u) => u.id === item.id) ? (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    size={32}
                    color={theme.colors.darkGreen}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircle}
                    size={32}
                    color={theme.colors.lightGray}
                  />
                )}
              </View>
            </View>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      ></SectionList>
    </>
  );
};
