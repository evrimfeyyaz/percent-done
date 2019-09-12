import React, { FunctionComponent } from 'react';
import { TextButton } from '..';
import { GestureResponderEvent, StyleSheet, TextStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface HeaderButtonProps {
  title: string;
  /**
   * Denotes whether or not this button is a primary action.
   */
  primary?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

export const HeaderButton: FunctionComponent<HeaderButtonProps> = ({ title, primary, onPress }) => {
  let style: TextStyle = styles.text;
  if (primary) {
    style = StyleSheet.flatten([styles.text, styles.textPrimary]);
  }

  return <TextButton title={title} style={style} onPress={onPress} />;
};

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    textAlign: 'right',
    textTransform: 'uppercase',
    fontFamily: fonts.regular,
    marginRight: 15,
  },
  textPrimary: {
    fontFamily: fonts.bold,
  },
});
