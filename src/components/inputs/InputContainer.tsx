import React, { FunctionComponent } from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors, fonts } from '../../theme';

interface InputContainerProps {
  /**
   * Title, shown on the left side.
   */
  title?: string,

  /**
   * Current value of the input, shown on the right side.
   */
  value?: string,
  onPress?: (event: GestureResponderEvent) => void,
}

export const InputContainer: FunctionComponent<InputContainerProps> = ({ title = null, value = null, onPress, children }) => {
  let titleText = null;
  if (title != null) {
    titleText = <Text style={styles.title}>{title}</Text>
  }

  let valueText = null;
  if (value != null) {
    valueText = <Text style={styles.value}>{value}</Text>
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {titleText}
      {children}
      {valueText}
      <Svg height={1} style={styles.bottomLine}>
        <Line
          x1='0%'
          x2='100%'
          stroke={colors.darkGray}
          strokeWidth={1}
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 3
  },
  value: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.yellow,
    textAlign: 'right',
    marginBottom: 3
  },
  bottomLine: {
    position: 'absolute',
    left: 20,
    bottom: 5,
    right: 0,
  },
});

