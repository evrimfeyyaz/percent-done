import React, { FunctionComponent } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { colors, fonts } from '../theme';

interface GoalRowProps {
  /**
   * Name of the goal.
   */
  name: string,
  /**
   * Color of the goal.
   */
  color: string,
  /**
   * Number of days this goal has been completed in a row.
   */
  chainLength?: number,
  /**
   * Total duration of the goal in minutes.
   */
  totalMinutes?: number,
  /**
   * Total minutes completed.
   */
  completedMinutes?: number,
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
                                                         }) => {

  const nameStyle = StyleSheet.flatten([styles.name, { color }]);

  let chainInfo = null;
  if (chainLength != null) {
    chainInfo = (
      <View style={styles.chainInfo}>
        <Image source={require('../../../assets/icons/link.png')} />
        <Text style={styles.chainLength}>{chainLength} days</Text>
      </View>
    );
  }

  let durationInfo = null;
  let progress = 0;
  if (totalMinutes != null && completedMinutes != null) {
    const { hours, minutes } = hoursAndMinutes(totalMinutes - completedMinutes);

    durationInfo = (
      <View>
        <Text style={styles.timeLeft}>{hours}h {minutes}m</Text>
        <Text style={styles.leftText}>Left</Text>
      </View>
    );

    progress = completedMinutes / totalMinutes;
  }

  return (
    <View style={styles.container}>
      <ProgressCircle style={{ height: 34, width: 34 }}
                      progress={progress}
                      backgroundColor={colors.darkGray}
                      progressColor={color}
                      strokeWidth={4}
                      endAngle={-Math.PI * 2} />
      <View style={styles.details}>
        <Text style={nameStyle}>{name}</Text>
        {chainInfo}
      </View>
      {durationInfo}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
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
});

/**
 * Separates total minutes into hours and minutes, i.e. 90 -> { hours: 1, minutes: 30 }
 *
 * @param totalMinutes Test
 */
function hoursAndMinutes(totalMinutes: number): { hours: number, minutes: number } {
  const minutes = totalMinutes % 60;
  totalMinutes = totalMinutes - minutes;
  const hours = totalMinutes / 60;

  return { hours, minutes };
}