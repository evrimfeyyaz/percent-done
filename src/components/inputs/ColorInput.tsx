import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { FlatList, Image, ImageStyle, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icons } from '../../../assets';

interface ColorInputProps {
  colors: string[];
  selectedColorIndex: number;
  onColorIndexChange?: (index: number) => void;
}

export const ColorInput: FunctionComponent<ColorInputProps> = ({
                                                                 colors,
                                                                 selectedColorIndex,
                                                                 onColorIndexChange,
                                                               }) => {
  const shouldHaveFillerColor = colors.length % 2 !== 0;
  const fillerColorIndex = colors.length;
  const numOfColumns = Math.ceil(colors.length / 2);
  const data = colors.map(color => ({ color, key: color }));

  // Add an extra itemKey to the end to make the rows equal length
  // if there are odd number of colors.
  if (shouldHaveFillerColor) {
    data.push({ color: 'filler', key: 'filler-item' });
  }

  function renderColorButton(index: number) {
    if (shouldHaveFillerColor && index === fillerColorIndex) {
      return <View style={styles.colorButton} />;
    }

    let selectedIndicatorStyle: ImageStyle = { display: 'none' };
    if (selectedColorIndex === index) {
      selectedIndicatorStyle = { display: 'flex' };
    }

    const color = colors[index];

    return (
      <TouchableOpacity
        style={[styles.colorButton, { backgroundColor: color }]}
        onPress={() => onColorIndexChange?.(index)}
      >
        <Image style={selectedIndicatorStyle} source={Icons.checkmark} />
      </TouchableOpacity>
    );
  }

  return (
    <InputContainer opacityOnTouch={false} contentStyle={styles.inputContainerContent}>
      <FlatList
        data={data}
        renderItem={({ index }) => renderColorButton(index)}
        numColumns={numOfColumns}
        columnWrapperStyle={styles.colorListRow}
      />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  inputContainerContent: {
    paddingEnd: 3,
  },
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
