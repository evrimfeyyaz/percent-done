import React, { FunctionComponent } from 'react';
import { ProgressCircle } from 'react-native-svg-charts';
import { StyleSheet, View, Text } from 'react-native';
import { colors, fonts } from '../../theme';

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
  return (
    <View style={styles.container}>
      <ProgressCircle
        style={styles.circle}
        progress={percentDone / 100}
        backgroundColor={colors.darkGray}
        progressColor={colors.yellow}
        strokeWidth={15}
        endAngle={-Math.PI * 2}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.percentDone}>
          {percentDone}
          <Text style={styles.percentSign}>%</Text>
        </Text>
        <Text style={styles.doneText}>Done</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 125,
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
