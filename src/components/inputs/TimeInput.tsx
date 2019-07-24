import React, { FunctionComponent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

export const TimeInput: FunctionComponent = () => {
  const [time, setTime] = useState(moment());

  const datePickerRef = useRef<DatePicker>(null);

  const handleTimeChange = (_: string, time: Date) => {
    setTime(moment(time));
  };

  return (
    <InputContainer title='Time' value={time.format('LT')}
                    onPress={() => {
                      const datePicker = datePickerRef.current;
                      if (datePicker != null) datePicker.onPressDate();
                    }}>
      <DatePicker
        showIcon={false}
        hideText={true}
        date={time}
        onDateChange={handleTimeChange}
        mode="time"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        ref={datePickerRef}
      />
    </InputContainer>
  );
};