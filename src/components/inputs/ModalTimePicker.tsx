import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';

interface ModelTimePickerProps {
}

const ITEM_SIZE = 40;

export const ModalTimePicker: FunctionComponent<ModelTimePickerProps> = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({ key: num.toString(), value: num.toString() }));

  return (
    <View>
      <ScrollablePicker data={data} index={3} text='H' onIndexChange={(index) => console.log(index)} />
    </View>
  );
};
