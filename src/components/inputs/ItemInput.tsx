import React, { FunctionComponent, useRef } from 'react';
import { BottomSheetItemPicker, InputContainer } from '..';

interface Item {
  key: string;
  value: string;
}

interface ItemInputProps {
  title: string;
  itemKey: string;
  allItems: Item[];
  onItemChange?: (itemKey: string) => void;
}

export const ItemInput: FunctionComponent<ItemInputProps> = ({ title, itemKey, allItems, onItemChange }) => {
  const bottomSheetItemPickerRef = useRef(null);

  // @ts-ignore
  const showBottomSheet = () => bottomSheetItemPickerRef?.current?.show();

  const handleInputContainerPress = () => {
    showBottomSheet();
  };

  const handleItemChange = (item: Item) => {
    onItemChange?.(item.key);
  };

  const item = allItems.find(it => it.key === itemKey) || allItems[0];

  return (
    <InputContainer
      title={title}
      value={item.value}
      opacityOnTouch={false}
      onPress={handleInputContainerPress}
    >
      <BottomSheetItemPicker ref={bottomSheetItemPickerRef} initialValue={item} onValueChange={handleItemChange}
                             allValues={allItems} />
    </InputContainer>
  );
};

