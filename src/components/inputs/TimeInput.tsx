import React, { FunctionComponent, useRef, useState } from 'react';
import { InputContainer, TimePicker, BottomSheet } from '..';
import { momentWithDeviceLocale } from '../../utilities';

interface TimeInputProps {
  time: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ time, onTimeChange }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  /**
   *  Keep the previous time, just in case the user cancels the bottom sheet.
   */
  const [prevTime, setPrevTime] = useState(new Date());

  const showBottomSheet = () => {
    setPrevTime(new Date(time.getTime()));
    if (bottomSheetRef != null && bottomSheetRef.current != null) {
      bottomSheetRef.current.open();
    }
  };

  const hideBottomSheet = () => {
    if (bottomSheetRef != null && bottomSheetRef.current != null) {
      bottomSheetRef.current.close();
    }
  };

  const handleTimeChange = (date: Date) => {
    if (onTimeChange != null) onTimeChange(date);
  };

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const handleCancelPress = () => {
    // Reverse changes.
    if (onTimeChange != null && prevTime != null && time.getTime() !== prevTime.getTime()) {
      onTimeChange(prevTime);
    }

    hideBottomSheet();
  };

  const handleDonePress = () => {
    hideBottomSheet();
  };

  const value = momentWithDeviceLocale(time).format('LT');

  return (
    <InputContainer
      title='Time'
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheet ref={bottomSheetRef} onCancelPress={handleCancelPress} onDonePress={handleDonePress}>
        <TimePicker time={time} onTimeChange={handleTimeChange} />
      </BottomSheet>
    </InputContainer>
  );
};
