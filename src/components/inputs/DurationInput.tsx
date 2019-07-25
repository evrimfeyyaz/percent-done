import React, { FunctionComponent, useRef } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';

interface DurationInputProps {
  hours?: number,
  minutes?: number,
  onDurationChange?: (hours: number, minutes: number) => void
}

export const DurationInput: FunctionComponent<DurationInputProps> = ({ hours = 1, minutes = 0, onDurationChange }) => {
  const datePickerRef = useRef<DatePicker>(null);

  const handleDurationChange = (duration: string, _: Date) => {
    const [hours, minutes] = duration.split(':').map(part => parseInt(part));

    if (onDurationChange != null) onDurationChange(hours, minutes);
  };

  return (
    <>
      <InputContainer title='Duration' value={formatDuration(hours, minutes)}
                      onPress={() => {
                        const datePicker = datePickerRef.current;
                        if (datePicker != null) datePicker.onPressDate();
                      }}>
        <DatePicker
          showIcon={false}
          hideText={true}
          date={formatDuration(hours, minutes)}
          onDateChange={handleDurationChange}
          mode="time"
          androidMode='spinner'
          locale='TR' // To make the time format 24h.
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          ref={datePickerRef}
        />
      </InputContainer>
    </>
  );
};

function formatDuration(hours: number, minutes: number) {
  return `${hours}h ${minutes}m`;
}