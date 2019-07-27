import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icons } from '../../../assets';

interface ColorInputProps {
  colors?: string[],
  selectedColor?: string,
  onColorChange?: (color: string) => void,
}

export const ColorInput: FunctionComponent<ColorInputProps> = ({ colors = [], selectedColor, onColorChange }) => {
  const colorButton = (color: string) => {
    let selectedIndicatorStyle = { display: 'none' };
    if (selectedColor === color) {
      selectedIndicatorStyle = { display: 'flex' };
    }

    return (<TouchableOpacity style={StyleSheet.flatten([styles.colorButton, { backgroundColor: color }])}
                              onPress={() => {
                                if (onColorChange != null) onColorChange(color);
                              }}>
      {/*
       // @ts-ignore */}
      <Image style={selectedIndicatorStyle} source={Icons.checkmark} />
    </TouchableOpacity>);
  };

  const numOfColumns = Math.ceil(colors.length / 2);
  const data = colors.map(color => ({ color, key: color }));

  // Add an extra item to the end to make the rows equal length
  // if there are odd number of colors.
  if (colors.length % 2 !== 0) {
    const transparentItem = 'rgba(0, 0, 0, 0)';
    data.push({ color: transparentItem, key: transparentItem });
  }

  return (
    <InputContainer opacityOnTouch={false}>
      <FlatList data={data} renderItem={({ item }) => colorButton(item.color)}
                numColumns={numOfColumns} columnWrapperStyle={styles.colorListRow} />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  colorListRow: {
    justifyContent: 'space-evenly',
  },
  colorButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});