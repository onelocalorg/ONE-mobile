/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { calendarTime } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";

import { DateTime } from "luxon";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

interface ChooseDateProps {
  children: string;
  date: DateTime;
  setDate: (date: DateTime) => void;
}
export const ChooseDate = ({ children, date, setDate }: ChooseDateProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [isPickerVisible, setPickerVisible] = useState(false);
  return (
    <View style={styles.row}>
      <View style={styles.circularView}>
        <ImageComponent source={calendarTime} style={styles.calendarTime} />
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setPickerVisible(true)}
        style={styles.margin}
      >
        <Text style={styles.time}>{children}</Text>
        <Text style={styles.time}>
          {date.toLocaleString(DateTime.DATETIME_MED)}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        date={date.toJSDate()}
        mode="datetime"
        onConfirm={(date) => {
          setDate(DateTime.fromJSDate(date));
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
};
