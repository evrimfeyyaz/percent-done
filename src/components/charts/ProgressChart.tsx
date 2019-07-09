import React, { FunctionComponent } from 'react';
import { ProgressCircle } from 'react-native-svg-charts';
import { StyleSheet, View, Text } from 'react-native';
import { colors, fonts } from '../theme';

interface ProgressChartProps {
  /**
   * Percentage of the work completed.
   */
  percentDone: number,
}

/**
 * Shows a circular chart.
 */
export const ProgressChart: FunctionComponent<ProgressChartProps> = ({ percentDone = 0 }) => {
  return (
    <>
      <ProgressCircle style={{ height: 125, width: 125 }}
                      progress={percentDone / 100}
                      backgroundColor={colors.darkGray}
                      progressColor={colors.yellow}
                      strokeWidth={15}
                      endAngle={-Math.PI * 2} />
      <View style={styles.infoContainer}>
        <Text style={styles.percentDone}>
          {percentDone}
          <Text style={styles.percentSign}>
            %
          </Text>
        </Text>
        <Text style={styles.done}>
          Done
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
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
  done: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    marginTop: -5,
  },
});