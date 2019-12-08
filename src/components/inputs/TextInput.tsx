import React, { FunctionComponent, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, fonts } from '../../theme';
import { InputContainer } from './InputContainer';

interface TextInputProps extends RNTextInputProps {
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  placeholderColor?: string;
}

export const TextInput: FunctionComponent<TextInputProps> = props => {
  const placeholderColor = props.placeholderColor || colors.gray;

  return (
    <InputContainer opacityOnTouch={false} error={props.error} onLayout={props.onLayout}>
      <RNTextInput
        style={StyleSheet.flatten([styles.input, props.style])}
        placeholderTextColor={placeholderColor}
        {...props}
        onLayout={undefined}
      />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
});
