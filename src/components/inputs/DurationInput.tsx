import React, { FunctionComponent, useRef } from 'react';
import { BottomSheetDurationPicker, InputContainer } from '..';

interface DurationInputProps {
  duration: { hours: number, minutes: number };
  onDurationChange?: (hours: number, minutes: number) => void;
}

export const DurationInput: FunctionComponent<DurationInputProps> = ({ duration, onDurationChange }) => {
  const bottomSheetDurationPickerRef = useRef<BottomSheetDurationPicker>(null);

  const showBottomSheet = () => {
    if (bottomSheetDurationPickerRef != null && bottomSheetDurationPickerRef.current != null) {
      bottomSheetDurationPickerRef.current.show();
    }
  };

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const value = `${duration.hours}h ${duration.minutes}m`;

  return (
    <InputContainer
      title='Duration'
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetDurationPicker ref={bottomSheetDurationPickerRef} initialDuration={duration}
                                 onDurationChange={onDurationChange} />
    </InputContainer>
  );
};
