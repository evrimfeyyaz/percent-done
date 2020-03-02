import React, { FunctionComponent, useRef } from 'react';
import { BottomSheetDurationPicker, InputContainer } from '..';

interface DurationInputProps {
  title?: string;
  duration: { hours: number, minutes: number };
  onDurationChange?: ({ hours, minutes }: { hours: number, minutes: number }) => void;
}

export const DurationInput: FunctionComponent<DurationInputProps> = ({ title, duration, onDurationChange }) => {
  const bottomSheetDurationPickerRef = useRef(null);

  // @ts-ignore
  const showBottomSheet = () => bottomSheetDurationPickerRef?.current?.show();

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const inputValue = `${duration.hours}h ${duration.minutes}m`;

  return (
    <InputContainer
      title={title ?? 'Duration'}
      value={inputValue}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetDurationPicker ref={bottomSheetDurationPickerRef} initialValue={duration}
                                 onValueChange={onDurationChange} />
    </InputContainer>
  );
};

