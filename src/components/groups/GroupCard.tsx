import _ from "lodash/fp";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { GroupIcon } from "~/assets/icons/GroupIcon";
import { dummy, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Group } from "~/types/group";
import { createStyleSheet } from "./style";

interface GroupCardProps {
  group: Group;
  disabled?: boolean;
  style?: any;
}

export const GroupCard = ({ group, style }: GroupCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoGroupDetails } = useNavigations();

  return (
    <TouchableOpacity
      style={style ?? styles.listContainer}
      onPress={gotoGroupDetails(group)}
      activeOpacity={0.8}
    >
      <ImageComponent
        resizeMode="stretch"
        uri={_.head(group.images)?.url}
        source={dummy}
        isUrl={!!_.head(group.images)?.url}
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text numberOfLines={2} style={styles.title}>
              {group.name}
            </Text>
          </View>
          <SvgXml xml={GroupIcon} width={30} fill="none" />
        </View>

        <View style={styles.row}>
          {group.address && (
            <>
              <ImageComponent source={pin} style={styles.pin} />
              <Text numberOfLines={3} style={styles.location}>
                {group.venue || group.address?.split(",")[0]}
              </Text>
            </>
          )}
          {/* <ImageComponent style={styles.addressDot} source={activeRadio}></ImageComponent> */}
          {/* <Text style={styles.fullAddress}>{full_address}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
