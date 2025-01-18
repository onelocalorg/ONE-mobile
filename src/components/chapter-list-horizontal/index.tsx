import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { inactiveRadio } from "~/assets/images";
import { ChapterData } from "~/types/chapter";
import { ImageComponent } from "../image-component";
import { Center } from "../ui/center";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { createStyleSheet } from "./style";

interface ChapterListHorizontalProps {
  chapters: ChapterData[];
  onRemoveChapter?: (chapter: ChapterData) => void;
}
export const ChapterListHorizontal = ({
  chapters,
  onRemoveChapter,
}: ChapterListHorizontalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const handleRemoveChapter = (chapter: ChapterData) => {
    onRemoveChapter!(chapter);
  };

  return (
    <ScrollView horizontal={true}>
      <HStack>
        {chapters.map((chapter) => (
          <Center key={chapter.id}>
            <View key={chapter.id} style={styles.chapterDetailsCont}>
              <View style={styles.detailsSubCont}>
                <ImageComponent
                  source={inactiveRadio}
                  resizeMode="cover"
                  style={styles.chapterImage}
                />
                {onRemoveChapter && (
                  <Pressable onPress={() => handleRemoveChapter(chapter)}>
                    <FontAwesomeIcon icon={faXmark} size={20} color="red" />
                  </Pressable>
                )}
              </View>
              <VStack>
                <Center>
                  <Text size="sm">{chapter.name}</Text>
                </Center>
              </VStack>
            </View>
          </Center>
        ))}
      </HStack>
    </ScrollView>
  );
};
