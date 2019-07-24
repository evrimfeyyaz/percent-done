import React, { FunctionComponent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';

export const TimeInput: FunctionComponent = () => {
  const [time, setTime] = useState(new Date());

  const datePickerRef = useRef<DatePicker>(null);

  const handleTimeChange = (_: string, time: Date) => {
    setTime(time);
  };

  return (
    <>
      <InputContainer title='Time' value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </>
  );
};