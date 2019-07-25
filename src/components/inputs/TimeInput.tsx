import React, { FunctionComponent, useRef } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

interface TimeInputProps {
  /**
   * A time string that is parseable by Minute.js.
   */
  time?: string,

  /**
   * Called when the value is changed by the user.
   *
   * @param time: 24h formatted time.
   */
  onTimeChange?: (time: string) => void,
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ time, onTimeChange }) => {
  const parsedTime = moment(time, ['h:m', 'h:m a']);

  const datePickerRef = useRef<DatePicker>(null);

  const handleTimeChange = (time: string, _: Date) => {
    if (onTimeChange != null) onTimeChange(time);
  };

  return (
    <InputContainer title='Time' value={parsedTime.format('LT')}
                    onPress={() => {
                      const datePicker = datePickerRef.current;
                      if (datePicker != null) datePicker.onPressDate();
                    }}>
      <DatePicker
        showIcon={false}
        hideText={true}
        date={parsedTime}
        onDateChange={handleTimeChange}
        mode="time"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        ref={datePickerRef}
      />
    </InputContainer>
  );
};