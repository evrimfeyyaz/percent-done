import React, { FunctionComponent } from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { colors, fonts } from '../theme';

interface TextButtonProps {
  title: string,
  onPress: (event: GestureResponderEvent) => void,
}

export const TextButton: FunctionComponent<TextButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.yellow,
  }
});