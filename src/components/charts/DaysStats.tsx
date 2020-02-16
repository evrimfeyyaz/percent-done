import React, { FunctionComponent } from 'react';
import { ProgressChart } from './ProgressChart';
import { StyleSheet, View } from 'react-native';
import { DurationInfo } from '..';

export interface DaysStatsProps {
  percentDone: number;
  completedMs: number;
  remainingMs: number;
}

export const DaysStats: FunctionComponent<DaysStatsProps> = ({ percentDone, completedMs, remainingMs }) => {
  return (
    <View style={styles.container}>
      <ProgressChart percentDone={percentDone} />
      <View style={styles.infoContainer}>
        <DurationInfo durationInMs={completedMs} tailText='done' />
        <DurationInfo durationInMs={remainingMs} tailText='left' roundLastValueUp={true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginStart: 20,
  },
});
