/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { DateTime } from "luxon";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { normalScale } from "~/theme/device/normalize";
import { createStyleSheet } from "./style";

interface ChooseDateProps {
  children: React.ReactNode;
  date: DateTime;
  setDate: (date: DateTime) => void;
}
export const ChooseDate = ({ children, date, setDate }: ChooseDateProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [isPickerVisible, setPickerVisible] = useState(false);
  return (
    <View>
      <Text style={{ marginBottom: normalScale(4) }}>{children}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setPickerVisible(true)}
        style={styles.margin}
      >
        <Text style={styles.time}>
          {date.toLocaleString(DateTime.DATE_MED) + "\n"}
          {date.toLocaleString(DateTime.TIME_SIMPLE)}
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
