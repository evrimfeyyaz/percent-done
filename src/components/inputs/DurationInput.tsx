import React, { FunctionComponent, useRef, useState } from 'react';
import { BottomSheet, DurationPicker, InputContainer } from '..';

interface DurationInputProps {
  duration: { hours: number, minutes: number };
  onDurationChange?: (hours: number, minutes: number) => void;
}

export const DurationInput: FunctionComponent<DurationInputProps> = ({ duration, onDurationChange }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  /**
   *  Keep the previous duration, just in case the user cancels the bottom sheet.
   */
  const [prevDuration, setPrevDuration] = useState(duration);

  const showBottomSheet = () => {
    setPrevDuration(duration);
    if (bottomSheetRef != null && bottomSheetRef.current != null) {
      bottomSheetRef.current.open();
    }
  };

  const hideBottomSheet = () => {
    if (bottomSheetRef != null && bottomSheetRef.current != null) {
      bottomSheetRef.current.close();
    }
  };

  const handleDurationChange = (hours: number, minutes: number) => {
    if (onDurationChange != null) onDurationChange(hours, minutes);
  };

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const handleCancelPress = () => {
    // Reverse changes.
    if (onDurationChange != null && prevDuration != null && (duration.hours !== prevDuration.hours || duration.minutes !== prevDuration.minutes)) {
      onDurationChange(prevDuration.hours, prevDuration.minutes);
    }

    hideBottomSheet();
  };

  const handleDonePress = () => {
    hideBottomSheet();
  };

  const value = `${duration.hours}h ${duration.minutes}m`;

  return (
    <InputContainer
      title='Duration'
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheet ref={bottomSheetRef} onCancelPress={handleCancelPress} onDonePress={handleDonePress}>
        <DurationPicker duration={duration} onDurationChange={handleDurationChange} />
      </BottomSheet>
    </InputContainer>
  );
};
