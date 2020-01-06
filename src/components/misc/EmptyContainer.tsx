import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface EmptyContainerProps {
  /**
   * The text that should be shown in the empty container.
   */
  text: string;
  style?: ViewStyle;
}

/**
 * A component that is shown when a container is empty.
 */
export const EmptyContainer: FunctionComponent<EmptyContainerProps> = ({ text, style }) => {
  return (
    <View style={[style, styles.container]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    opacity: .3,
  },
});
