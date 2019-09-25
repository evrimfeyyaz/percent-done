import React, { FunctionComponent } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent, TextStyle,
} from 'react-native';
import { colors, fonts } from '../../theme';

interface TextButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: TextStyle;
}

export const TextButton: FunctionComponent<TextButtonProps> = ({
                                                                 title,
                                                                 onPress,
                                                                 style,
                                                               }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={StyleSheet.flatten([styles.title, style])}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.yellow,
  },
});
