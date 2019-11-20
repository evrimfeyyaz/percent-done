import React, { FunctionComponent, useRef } from 'react';
import { InputContainer, BottomSheetTimePicker } from '..';
import { momentWithDeviceLocale } from '../../utilities';

interface TimeInputProps {
  title: string;
  time: Date;
  error?: string;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({ title, time, onTimeChange, error }) => {
  const bottomSheetTimePickerRef = useRef(null);

  // @ts-ignore
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
      error={error}
      onPress={handleInputContainerPress}
    >
      <BottomSheetTimePicker ref={bottomSheetTimePickerRef} onValueChange={onTimeChange} initialValue={time} />
    </InputContainer>
  );
};
