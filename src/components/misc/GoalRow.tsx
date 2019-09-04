import React, { FunctionComponent } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { colors, fonts } from '../../theme';
import { Icons } from '../../../assets';

export interface GoalRowProps {
  name: string;
  color: string;
  /**
   * Number of days this goal has been completed in a row.
   */
  chainLength?: number;
  /**
   * Total duration of the goal in minutes.
   */
  totalMinutes?: number;
  /**
   * Total minutes completed.
   */
  completedMinutes?: number;
  /**
   * Current progress of the goal.
   */
  progressPercentage?: number;
}

/**
 * A row that shows information on a given goal.
 */
export const GoalRow: FunctionComponent<GoalRowProps> = ({
                                                           name,
                                                           color,
                                                           chainLength = null,
                                                           totalMinutes = null,
                                                           completedMinutes = null,
                                                           progressPercentage = 0,
                                                         }) => {
  const nameStyle = StyleSheet.flatten([styles.name, { color }]);

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
  if (totalMinutes != null && completedMinutes != null) {
    const { hours, minutes } = hoursAndMinutes(totalMinutes - completedMinutes);

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
    <View style={styles.container}>
      <ProgressCircle
        style={styles.circle}
        progress={progressPercentage}
        backgroundColor={colors.darkGray}
        progressColor={color}
        strokeWidth={4}
        endAngle={-Math.PI * 2}
      />
      <View style={styles.details}>
        <Text style={nameStyle}>{name}</Text>
        {chainInfo}
      </View>
      {durationInfo}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    width: '100%',
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
});

/**
 * Separates total minutes into hours and minutes, i.e. 90 -> { hours: 1, minutes: 30 }
 *
 * @param totalMinutes Test
 */
function hoursAndMinutes(
  totalMinutes: number,
): { hours: number; minutes: number } {
  const minutes = totalMinutes % 60;
  totalMinutes = totalMinutes - minutes;
  const hours = totalMinutes / 60;

  return { hours, minutes };
}
