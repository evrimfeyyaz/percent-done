import React, { FunctionComponent } from 'react';
import { ProgressChart } from './ProgressChart';
import { StyleSheet, Text, View } from 'react-native';
import { textStyles } from '../../theme';
import { deconstructFormattedDuration, formatDurationInMs } from '../../utilities';

interface DaysStatsProps {
  percentDone: number;
  completedMs: number;
  remainingMs: number;
}

export const DaysStats: FunctionComponent<DaysStatsProps> = ({ percentDone, completedMs, remainingMs }) => {
  const {
    firstPart: completedFirstPart,
    firstDenotation: completedFirstDenotation,
    secondPart: completedSecondPart,
    secondDenotation: completedSecondDenotation,
  } = deconstructFormattedDuration(formatDurationInMs(completedMs));

  const {
    firstPart: remainingFirstPart,
    firstDenotation: remainingFirstDenotation,
    secondPart: remainingSecondPart,
    secondDenotation: remainingSecondDenotation,
  } = deconstructFormattedDuration(formatDurationInMs(remainingMs, true));

  return (
    <View style={styles.container}>
      <ProgressChart percentDone={percentDone} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={textStyles.info}>
            {completedFirstPart}
            <Text style={textStyles.infoLabel}>{completedFirstDenotation.toUpperCase()}</Text>
            &nbsp;{completedSecondPart}
            <Text style={textStyles.infoLabel}>{completedSecondDenotation.toUpperCase()}</Text>
            <Text style={textStyles.infoTail}> done</Text>
          </Text>
        </View>
        <View>
          <Text style={textStyles.info}>
            {remainingFirstPart}
            <Text style={textStyles.infoLabel}>{remainingFirstDenotation.toUpperCase()}</Text>
            &nbsp;{remainingSecondPart}
            <Text style={textStyles.infoLabel}>{remainingSecondDenotation.toUpperCase()}</Text>
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
