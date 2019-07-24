import React, { FunctionComponent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';

export const DurationInput: FunctionComponent = () => {
  const [duration, setDuration] = useState('00:00');

  const datePickerRef = useRef<DatePicker>(null);

  const handleDurationChange = (duration: string, _: Date) => {
    setDuration(duration);
  };

  return (
    <>
      <InputContainer title='Duration' value={formatDuration(duration)}
                      onPress={() => {
                        const datePicker = datePickerRef.current;
                        if (datePicker != null) datePicker.onPressDate();
                      }}>
        <DatePicker
          showIcon={false}
          hideText={true}
          date={duration}
          onDateChange={handleDurationChange}
          mode="time"
          locale='TR' // To make the time format 24h.
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          ref={datePickerRef}
        />
      </InputContainer>
    </>
  );
};

function formatDuration(duration: string) {
  const [hour, minute] = duration.split(':');

  return `${hour}h ${minute}m`;
}