import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { dummy, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Group } from "~/types/group";
import { createStyleSheet } from "./style";

interface GroupCardProps {
  group: Group;
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
        uri={group.pic?.url}
        source={dummy}
        isUrl={!!group.pic?.url}
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            {group.address && (
              <Text style={styles.dateText}>
                {group.venue}
                {" • "}
                {group.address}
              </Text>
            )}
            <Text numberOfLines={2} style={styles.title}>
              {group.name}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <ImageComponent source={pin} style={styles.pin} />
          {/* <ImageComponent style={styles.addressDot} source={activeRadio}></ImageComponent> */}
          {/* <Text style={styles.fullAddress}>{full_address}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
