import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

export type DatePickerRefProps = {
  onOpenModal: (type: 'start' | 'end') => void;
  onCloseModal: () => void;
};

interface DateRangePickerProps {
  selectStartDate?: (date: Date) => void;
  selectEndDate?: (date: Date) => void;
}

const DateRangePickerComp = (
  props: DateRangePickerProps,
  ref: React.Ref<unknown> | undefined,
) => {
  const {selectEndDate, selectStartDate} = props || {};
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('');

  useImperativeHandle(ref, () => ({
    onOpenModal(type: 'start' | 'end') {
      if (type === 'start') {
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
    setPickerType('start');
  };

  const showEndDatePicker = () => {
    setShowPicker(true);
    setPickerType('end');
  };

  const handlePickerChange = (selectedDate: Date) => {
    setShowPicker(false);
    const currentDate = selectedDate || new Date();

    if (pickerType === 'start') {
      setStartDate(currentDate);
      setEndDate(currentDate);
      selectStartDate?.(currentDate);
      selectEndDate?.(currentDate);
    } else {
      setEndDate(currentDate);
      selectEndDate?.(currentDate);
    }
  };

  return (
    <View>
      {showPicker && (
        <DateTimePicker
          isVisible={true}
          date={pickerType === 'start' ? startDate : endDate}
          mode="datetime"
          is24Hour={true}
          display="spinner"
          minimumDate={pickerType === 'start' ? new Date() : startDate}
          onConfirm={handlePickerChange}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </View>
  );
};

export const DateRangePicker = forwardRef(DateRangePickerComp);
