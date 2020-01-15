import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatChart, StatChartData } from '..';
import { deconstructFormattedDuration, formatDurationInMs, getMedian } from '../../utilities';
import { textStyles } from '../../theme';

interface HoursDoneStatsProps {
  data: StatChartData;
}

export const HoursDoneStats: FunctionComponent<HoursDoneStatsProps> = ({ data }) => {
  const values = data.map(datum => datum.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const median = getMedian(values);

  const msToHours = (ms: number) => ms / (1000 * 60 * 60);
  const dataInHours = data.map(datum => ({ value: msToHours(datum.value), label: datum.label }));
  const minInHours = msToHours(min);
  const maxInHours = msToHours(max);
  const medianInHours = msToHours(median);

  function renderDataInText(value: number, text: string) {
    const {
      firstPart,
      firstDenotation,
      secondPart,
      secondDenotation,
    } = deconstructFormattedDuration(formatDurationInMs(value));

    return (
      <Text style={textStyles.info}>
        {firstPart}
        <Text style={textStyles.infoLabel}>{firstDenotation}</Text>
        &nbsp;{secondPart}
        <Text style={textStyles.infoLabel}>{secondDenotation}</Text>
        <Text style={textStyles.infoTail}> {text}</Text>
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <StatChart data={dataInHours} min={minInHours} max={maxInHours} median={medianInHours} />

      <View style={styles.dataInText}>
        {renderDataInText(median, 'median')}
        {renderDataInText(max, 'maximum')}
        {renderDataInText(min, 'minimum')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dataInText: {
    marginTop: 20,
    alignItems: 'center',
  },
});
