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
import { convertSecondsToHoursAndMinutes } from '../../utilities';

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
   * Total duration of the goal in seconds.
   */
  totalSeconds?: number;
  completedSeconds?: number;
  /**
   * For non-time-tracked goals. Should be `undefined` for time-tracked goals.
   */
  isCompleted?: boolean;
  style?: ViewStyle;
}

/**
 * A row that shows information on a given goal.
 */
export const GoalRow: FunctionComponent<GoalRowProps> = ({
                                                           id,
                                                           title,
                                                           color,
                                                           chainLength = null,
                                                           totalSeconds = null,
                                                           completedSeconds = null,
                                                           isCompleted = false,
                                                           style,
                                                         }) => {
  const nameStyle = StyleSheet.flatten([styles.name, { color }]);

  let progressPercentage = 0;
  if (isCompleted) {
    progressPercentage = 100;
  } else if (totalSeconds != null && completedSeconds != null) {
    progressPercentage = completedSeconds / totalSeconds;
  }


  let chainInfo = null;
  if (chainLength != null) {
    chainInfo = (
      <View style={styles.chainInfo}>
        <Image source={Icons.link} />
        <Text style={styles.chainLength}>{chainLength} days</Text>
      </View>
    );
  }

  let durationInfo = null;
  if (totalSeconds != null && completedSeconds != null) {
    let { hours, minutes } = convertSecondsToHoursAndMinutes(totalSeconds - completedSeconds);
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);

    durationInfo = (
      <View>
        <Text style={styles.timeLeft}>
          {hours}h {minutes}m
        </Text>
        <Text style={styles.leftText}>Left</Text>
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
        <Text style={nameStyle}>{title}</Text>
        {chainInfo}
      </View>
      {durationInfo}
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
