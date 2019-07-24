import React, { FunctionComponent, useRef } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

interface TimeInputProps {
  /**
   * A time string that is parseable by Minute.js.
   */
  value?: string,

  /**
   * Called when the value is changed by the user.
   *
   * @param value: 24h formatted time.
   */
  onValueChange?: (value: string) => void,
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ value, onValueChange }) => {
  const parsedTime = moment(value, ['h:m', 'h:m a']);

  const datePickerRef = useRef<DatePicker>(null);

  const handleTimeChange = (time: string, _: Date) => {
    if (onValueChange != null) onValueChange(time);
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