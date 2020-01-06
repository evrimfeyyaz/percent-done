import React, { FunctionComponent } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View, ViewStyle,
  Animated,
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { colors, fonts } from '../../theme';
import { Icons } from '../../../assets';
import { formatDurationInMs, leftOrOver, pluralize } from '../../utilities';

export interface GoalRowProps {
  /**
   * Goal ID.
   */
  id: string;
  title: string;
  color: string;
  /**
   * Number of days this goal has been completed in a row.
   */
  chainLength: number;
  /**
   * Total duration of the goal in milliseconds.
   */
  totalMs?: number;
  completedMs?: number;
  /**
   * For non-time-tracked goals. Should be `undefined` for time-tracked goals.
   */
  isCompleted?: boolean;
  /**
   * Whether or not today is included among the recurring days of the goal.
   */
  isActiveToday: boolean;
  style?: ViewStyle;
}

/**
 * A row that shows information on a given goal.
 */
export const GoalRow: FunctionComponent<GoalRowProps> = ({
                                                           title,
                                                           color,
                                                           chainLength = null,
                                                           totalMs = null,
                                                           completedMs = null,
                                                           isActiveToday,
                                                           isCompleted = false,
                                                           style,
                                                         }) => {
  const nameStyle = StyleSheet.flatten([styles.name, { color }]);

  let progressPercentage = 0;
  if (isCompleted) {
    progressPercentage = 100;
  } else if (totalMs != null && completedMs != null) {
    progressPercentage = completedMs / totalMs;
  }


  let chainInfo = null;
  if (chainLength != null) {
    chainInfo = (
      <View style={styles.chainInfo}>
        <Image source={Icons.link} />
        <Text style={styles.chainLength}>{chainLength} {pluralize('day', chainLength)}</Text>
      </View>
    );
  }

  let durationInfo = null;
  if (totalMs != null && completedMs != null) {
    const remainingMs = totalMs - completedMs;

    durationInfo = (
      <View>
        <Text style={styles.timeLeft}>
          {formatDurationInMs(remainingMs, remainingMs >= 0)}
        </Text>
        <Text style={styles.leftText}>{leftOrOver(remainingMs)}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={StyleSheet.flatten([styles.container, style])}>
      <ProgressCircle
        style={styles.circle}
        progress={progressPercentage}
        backgroundColor={colors.darkGray}
        progressColor={color}
        strokeWidth={4}
        endAngle={-Math.PI * 2}
      />
      <View style={styles.details}>
        <Text style={nameStyle} numberOfLines={1}>{title}</Text>
        {chainInfo}
      </View>
      {isActiveToday && durationInfo}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  details: {
    flex: 1,
    paddingHorizontal: 20,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  chainInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainLength: {
    marginStart: 3,
    color: colors.gray,
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  timeLeft: {
    textAlign: 'right',
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  leftText: {
    textAlign: 'right',
    color: colors.gray,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  circle: {
    height: 34,
    width: 34,
  },
  leftActionContainer: {
    backgroundColor: colors.blue,
    justifyContent: 'center',
    flex: 1,
  },
  leftActionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
});
