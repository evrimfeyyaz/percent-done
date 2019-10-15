import React, { FunctionComponent, useRef } from 'react';
import { InputContainer, BottomSheetTimePicker } from '..';
import { momentWithDeviceLocale } from '../../utilities';

interface TimeInputProps {
  time: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ time, onTimeChange }) => {
  const bottomSheetTimePickerRef = useRef<BottomSheetTimePicker>(null);

  const showBottomSheet = () => bottomSheetTimePickerRef?.current?.show();

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const value = momentWithDeviceLocale(time).format('LT');

  return (
    <InputContainer
      title='Time'
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetTimePicker ref={bottomSheetTimePickerRef} onTimeChange={onTimeChange} initialTime={time} />
    </InputContainer>
  );
};
