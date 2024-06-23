import { forwardRef, useImperativeHandle, useState } from "react";
import { Calendar } from "react-native-calendars";

interface CalenderComponentProps {}

export type CalenderRefProps = {
  onOpenModal: () => void;
  onCloseModal: () => void;
};

export const CalenderComponent = (
  props: CalenderComponentProps,
  ref: React.Ref<unknown> | undefined
) => {
  const {} = props || {};
  const [selected, setSelected] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState("");

  useImperativeHandle(ref, () => ({
    onOpenModal(type: "start" | "end") {
      if (type === "start") {
        showStartDatePicker();
        return;
      }
      showEndDatePicker();
    },
    onCloseModal() {
      showEndDatePicker();
    },
  }));

  const showStartDatePicker = () => {
    setShowPicker(true);
    setPickerType("start");
  };

  const showEndDatePicker = () => {
    setShowPicker(true);
    setPickerType("end");
  };

  return (
    <Calendar
      ref={ref}
      onDayPress={(day) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          //   selectedDotColor: 'orange',
        },
      }}
    />
  );
};

export const CalenderComponentModal = forwardRef(CalenderComponent);
