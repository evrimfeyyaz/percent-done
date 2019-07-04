import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

interface SectionProps {
  title: string,
}

export const Section: FunctionComponent<SectionProps> = ({ title, children = null }) => {
  const [titleMarginStart, setTitleMarginStart] = useState(0);

  /**
   * Adjusts the margin of the container title to lay against
   * the left side of the screen.
   * @param e
   */
  const adjustMarginStart = (e: LayoutChangeEvent) => {
    let { width, height } = e.nativeEvent.layout;

    setTitleMarginStart(-(width / 2) + (height / 2) + 20);
  };

  return (
    <View style={styles.container}>
      <Text style={StyleSheet.flatten([styles.title, { marginStart: titleMarginStart }])}
            onLayout={adjustMarginStart}>
        {title}
      </Text>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 12,
    left: 0,
    position: 'absolute',
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
    zIndex: 999,
  },
  content: {
    color: '#fff',
    flex: 1,
    paddingStart: 60,
  },
});