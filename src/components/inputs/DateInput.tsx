import React, { FunctionComponent, useRef } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';
import { isToday, isTomorrow } from '../../utilities';
import moment, { Moment } from 'moment';

interface DateInputProps {
  date?: Date,
  onDateChange?: (date: Date) => void,
}

export const DateInput: FunctionComponent<DateInputProps> = ({ date, onDateChange }) => {
  const datePickerRef = useRef<DatePicker>(null);

  const handleDateChange = (_: string, date: Date) => {
    if (onDateChange != null) onDateChange(date);
  };

  return (
    <>
      <InputContainer title='Date' value={formatDate(moment(date))} onPress={() => {
        const datePicker = datePickerRef.current;
        if (datePicker != null) datePicker.onPressDate();
      }}>
        <DatePicker
          showIcon={false}
          hideText={true}
          minDate={new Date()}
          date={date}
          onDateChange={handleDateChange}
          mode="date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          ref={datePickerRef}
        />
      </InputContainer>
    </>
  );
};

function formatDate(date: Moment) {
  if (isToday(date)) {
    return 'Today';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  return date.format('LL');
}