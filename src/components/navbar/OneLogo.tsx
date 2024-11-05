import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Menu } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { onelogo } from "~/assets/images";
import { AppContext } from "~/navigation/AppContext";
import { useChapterService } from "~/network/api/services/useChapterService";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

export const OneLogo = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { chapterFilter, setChapterFilter } = useContext(AppContext)!;

  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: chapters } = useQuery(listChapters());

  function chapterNameSpaced() {
    let spaced = "";
    for (const c of chapterFilter?.name || "Global") {
      spaced += c + " ";
    }
    return spaced;
  }

  return (
    <View style={styles.oneContainer}>
      <ImageComponent
        style={styles.oneContainerImage}
        source={onelogo}
      ></ImageComponent>
      <View>
        <Text style={styles.oneContainerText}>NE</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Pressable onPress={openMenu}>
              <Text style={styles.localText}>
                {chapterNameSpaced()}
                <Text style={{ fontSize: 10 }}>{"\u25BC"}</Text>
              </Text>
            </Pressable>
          }
        >
          <Menu.Item
            key={""}
            onPress={() => {
              setChapterFilter(null);
              closeMenu();
            }}
            title={"Global"}
          />

          {chapters?.map((chapter) => (
            <Menu.Item
              key={chapter.id}
              onPress={() => {
                setChapterFilter(chapter);
                closeMenu();
              }}
              title={chapter.name}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
};
