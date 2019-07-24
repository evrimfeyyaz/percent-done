import React, { FunctionComponent } from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { colors, fonts } from '../../theme';
import { InputContainer } from './InputContainer';

export const TextInput: FunctionComponent<TextInputProps> = (props) => {
  return (
    <InputContainer>
      <RNTextInput style={StyleSheet.flatten([styles.input, props.style])} placeholderTextColor={colors.gray} {...props} />
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