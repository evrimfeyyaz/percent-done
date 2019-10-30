import React, { FunctionComponent, useRef } from 'react';
import { InputContainer, BottomSheetTimePicker } from '..';
import { momentWithDeviceLocale } from '../../utilities';

interface TimeInputProps {
  title: string;
  time: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ title, time, onTimeChange }) => {
  const bottomSheetTimePickerRef = useRef<BottomSheetTimePicker>(null);

  const showBottomSheet = () => bottomSheetTimePickerRef?.current?.show();

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const value = momentWithDeviceLocale(time).format('LT');

  return (
    <InputContainer
      title={title}
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetTimePicker ref={bottomSheetTimePickerRef} onTimeChange={onTimeChange} initialTime={time} />
    </InputContainer>
  );
};
