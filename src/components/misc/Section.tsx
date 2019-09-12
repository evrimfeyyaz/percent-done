import React, { FunctionComponent, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  title: string;
  bottomSeparator?: boolean;
}

export const Section: FunctionComponent<Props> = ({
                                                    title,
                                                    bottomSeparator = true,
                                                    children = null,
                                                  }) => {
  const MARGIN = 20;

  const [titleMarginStart, setTitleMarginStart] = useState(0);
  const [titleTopPosition, setTitleTopPosition] = useState(0);
  const [containerMinHeight, setContainerMinHeight] = useState(0);

  const moveTitleLeft = (titleWidth: number, titleHeight: number) => {
    setTitleMarginStart(-(titleWidth / 2) + titleHeight / 2 + MARGIN);
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

  const bottomSeparatorComponent = bottomSeparator ? (
    <View style={styles.separator} />
  ) : null;

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { minHeight: containerMinHeight },
      ])}
    >
      <Text
        style={StyleSheet.flatten([
          styles.title,
          { marginStart: titleMarginStart, top: titleTopPosition },
        ])}
        onLayout={handleTitleLayout}
      >
        {title}
      </Text>

      <View style={styles.content}>{children}</View>

      {bottomSeparatorComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
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
    paddingEnd: 20,
    paddingBottom: 30,
  },
  separator: {
    borderBottomColor: colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.2,
    bottom: 0,
    right: 0,
    width: '84%',
    position: 'absolute',
  },
});
