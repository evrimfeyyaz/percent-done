import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

interface SectionProps {
  /**
   * Title of the section.
   */
  title: string,
}

/**
 * Container for a section.
 */
export const Section: FunctionComponent<SectionProps> = ({ title, children = null }) => {
  const MARGIN = 20;

  const [titleMarginStart, setTitleMarginStart] = useState(0);
  const [titleTopPosition, setTitleTopPosition] = useState(0);
  const [containerMinHeight, setContainerMinHeight] = useState(0);

  const moveTitleLeft = (titleWidth: number, titleHeight: number) => {
    setTitleMarginStart(-(titleWidth / 2) + (titleHeight / 2) + MARGIN);
  };

  const moveTitleIntoContainer = (titleWidth: number) => {
    const offset = -6;

    setTitleTopPosition(titleWidth / 2 + offset);
  };

  const fitTitleInContainer = (titleWidth: number) => {
    setContainerMinHeight(titleWidth + MARGIN);
  };

  const handleTitleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;

    moveTitleLeft(width, height);
    moveTitleIntoContainer(width);
    fitTitleInContainer(width);
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { minHeight: containerMinHeight }])}>
      <Text style={StyleSheet.flatten([styles.title, { marginStart: titleMarginStart, top: titleTopPosition }])}
            onLayout={handleTitleLayout}>
        {title}
      </Text>

      <View style={styles.content}>
        {children}
      </View>

      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: 12,
    left: 0,
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    textTransform: 'uppercase',
    zIndex: 999,
  },
  content: {
    flex: 1,
    paddingStart: 60,
  },
  separator: {
    borderBottomColor: colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: .2,
    bottom: 0,
    right: 0,
    width: '84%',
    position: 'absolute',
  },
});