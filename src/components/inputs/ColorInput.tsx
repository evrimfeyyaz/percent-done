import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { FlatList, Image, ImageStyle, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icons } from '../../../assets';

interface ColorInputProps {
  colors: string[];
  selectedColor: string;
  onColorChange?: (color: string) => void;
}

export const ColorInput: FunctionComponent<ColorInputProps> = ({
                                                                 colors,
                                                                 selectedColor,
                                                                 onColorChange,
                                                               }) => {
  const colorButton = (color: string) => {
    if (color === 'transparent') {
      return <View style={styles.colorButton} />;
    }

    let selectedIndicatorStyle: ImageStyle = { display: 'none' };
    if (selectedColor === color) {
      selectedIndicatorStyle = { display: 'flex' };
    }

    return (
      <TouchableOpacity
        style={StyleSheet.flatten([styles.colorButton, { backgroundColor: color }])}
        onPress={() => onColorChange && onColorChange(color)}
      >
        <Image style={selectedIndicatorStyle} source={Icons.checkmark} />
      </TouchableOpacity>
    );
  };

  const numOfColumns = Math.ceil(colors.length / 2);
  const data = colors.map(color => ({ color, key: color }));

  // Add an extra item to the end to make the rows equal length
  // if there are odd number of colors.
  if (colors.length % 2 !== 0) {
    data.push({ color: 'transparent', key: 'transparent-item' });
  }

  return (
    <InputContainer opacityOnTouch={false}>
      <FlatList
        data={data}
        renderItem={({ item }) => colorButton(item.color)}
        numColumns={numOfColumns}
        columnWrapperStyle={styles.colorListRow}
      />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  colorListRow: {
    justifyContent: 'space-between',
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
