import React, { FunctionComponent, useEffect, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  title: string;
  index: number;
  onPress?: (index: number) => void;
  style?: ViewStyle;
  disabled?: boolean;
  onLayout?: (index: number, event: LayoutChangeEvent) => void;
  /**
   * An animated value between 0 and 1, used for transitioning during tab selection animations.
   * 0 means not selected, and 1 means selected. Anything in between means tab selection is
   * changing.
   */
  selectionStatus?: Animated.Value;
}

export const TabItem: FunctionComponent<Props> = ({
                                                    title, index, onPress, disabled, onLayout,
                                                    selectionStatus = new Animated.Value(0), style,
                                                  }) => {
  const handlePress = () => {
    if (onPress != null) {
      onPress(index);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    if (onLayout != null) {
      onLayout(index, event);
    }
  };

  const titleColor = Animated.diffClamp(selectionStatus, 0, 1).interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray, colors.white],
  });
  const titleStyle = { color: titleColor };

  return (
    <TouchableOpacity
      style={style}
      onPress={handlePress}
      disabled={disabled}
      onLayout={handleLayout}
    >
      {/*
      // @ts-ignore */}
      <Animated.Text style={StyleSheet.flatten([styles.title, titleStyle])}>{title}</Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.regular,
    color: colors.gray,
    fontSize: 20,
    textTransform: 'uppercase',
    width: '100%',
  },
});
