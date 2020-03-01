import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';

interface Item {
  key: string;
  value: string;
}

interface ItemPickerProps {
  initialValue: Item;
  allValues?: Item[];
  onValueChange?: (value: Item) => void;
}

export const ItemPicker: FunctionComponent<ItemPickerProps> = ({ initialValue, allValues = [], onValueChange }) => {
  const [itemKey, setItemKey] = useState(initialValue.key);

  const selectedItemIndex = allValues?.findIndex(item => item.key === itemKey);

  const handleItemIndexChange = (index: number) => {
    console.log(index);
    const newItem = allValues[index];

    setItemKey(newItem.key);
    onValueChange?.(newItem);
  };

  return (
    <View style={styles.container}>
      <ScrollablePicker data={allValues} index={selectedItemIndex} style={styles.picker}
                        onIndexChange={handleItemIndexChange} alignment='center' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    paddingHorizontal: 30,
  },
  picker: {
    marginHorizontal: 10,
  },
});
