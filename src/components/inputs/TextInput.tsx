import React, { FunctionComponent } from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps, View } from 'react-native';
import { colors, fonts } from '../theme';
import Svg, { Line } from 'react-native-svg';

export const TextInput: FunctionComponent<TextInputProps> = (props) => {
  return (
    <View style={styles.container}>
      <RNTextInput style={StyleSheet.flatten([styles.input, props.style])} placeholderTextColor={colors.gray} {...props} />
      <Svg height={1} width='100%' style={styles.bottomLine}>
        <Line
          x1='0%'
          x2='100%'
          stroke={colors.gray}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 45,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
  bottomLine: {
    marginTop: -7,
  }
});