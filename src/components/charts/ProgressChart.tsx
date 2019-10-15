import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { colors, fonts } from '../../theme';
import { usePrevious } from '../../utilities';
import { AnimatedProgressCircle } from './AnimatedProgressCircle';

interface Props {
  /**
   * Percentage of the work completed.
   */
  percentDone: number;
}

/**
 * Shows a circular chart.
 */
export const ProgressChart: FunctionComponent<Props> = ({ percentDone = 0 }) => {
  const prevPercentDone = usePrevious(percentDone);

  const animatedProgress = new Animated.Value(prevPercentDone || 0);

  useEffect(() => {
    Animated.timing(animatedProgress, { toValue: percentDone, duration: 500 }).start();
  }, [percentDone]);

  return (
    <View style={styles.container}>
      <AnimatedProgressCircle
        style={styles.circle}
        progress={animatedProgress.interpolate({ inputRange: [0, 100], outputRange: [0, 1] })}
        backgroundColor={colors.darkGray}
        progressColor={colors.yellow}
        strokeWidth={15}
        endAngle={-Math.PI * 2}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.percentDone}>
          {Math.floor(percentDone)}
          <Text style={styles.percentSign}>%</Text>
        </Text>
        <Text style={styles.doneText}>Done</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 126,
  },
  infoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentDone: {
    fontFamily: fonts.semibold,
    fontSize: 36,
    color: colors.white,
  },
  percentSign: {
    fontSize: 12,
  },
  doneText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    marginTop: -5,
  },
  circle: {
    height: 125,
    width: 125,
  },
});
