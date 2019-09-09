import React, { FunctionComponent } from 'react';
import { ProgressChart } from './ProgressChart';
import { StyleSheet, Text, View } from 'react-native';
import { textStyles } from '../../theme';
import { convertSecondsToHoursAndMinutes } from '../../utilities';

interface DaysStatsProps {
  percentDone: number;
  completedSeconds: number;
  remainingSeconds: number;
}

export const DaysStats: FunctionComponent<DaysStatsProps> = ({ percentDone, completedSeconds, remainingSeconds }) => {
  const { hours: completedHours, minutes: completedMinutes } = convertSecondsToHoursAndMinutes(completedSeconds);
  const { hours: remainingHours, minutes: remainingMinutes } = convertSecondsToHoursAndMinutes(remainingSeconds);

  return (
    <View style={styles.container}>
      <ProgressChart percentDone={percentDone} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={textStyles.info}>
            {completedHours}
            <Text style={textStyles.infoSmall}>H</Text>
            &nbsp;{completedMinutes}
            <Text style={textStyles.infoSmall}>M</Text>
            <Text style={textStyles.infoTail}> done</Text>
          </Text>
        </View>
        <View>
          <Text style={textStyles.info}>
            {remainingHours}
            <Text style={textStyles.infoSmall}>H</Text>
            &nbsp;{remainingMinutes}
            <Text style={textStyles.infoSmall}>M</Text>
            <Text style={textStyles.infoTail}> left</Text>
          </Text>
        </View>
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
