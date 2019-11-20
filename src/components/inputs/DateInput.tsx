import React, { FunctionComponent, useRef } from 'react';
import { InputContainer, BottomSheetDatePicker } from '..';
import { momentWithDeviceLocale } from '../../utilities';

interface DateInputProps {
  title: string;
  date: Date;
  onDateChange?: (date: Date) => void;
}

export const DateInput: FunctionComponent<DateInputProps> = ({ title, date, onDateChange }) => {
  const bottomSheetDatePickerRef = useRef(null);

  // @ts-ignore
  const showBottomSheet = () => bottomSheetDatePickerRef?.current?.show();

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const value = momentWithDeviceLocale(date).format('LL');

  return (
    <InputContainer
      title={title}
      value={value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetDatePicker ref={bottomSheetDatePickerRef} onValueChange={onDateChange} initialValue={date} />
    </InputContainer>
  );
};
