import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { inactiveRadio } from "~/assets/images";
import { ChapterData } from "~/types/chapter";
import { ImageComponent } from "../image-component";
import { HStack } from "../ui/hstack";
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
    <HStack>
      {chapters.map((chapter) => (
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
          <View style={styles.chapterNameCont}>
            <Text style={styles.chapternameLbl}>{chapter.name}</Text>
          </View>
        </View>
      ))}
    </HStack>
  );
};
