import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatChart, StatChartData } from '..';
import { deconstructFormattedDuration, formatDurationInMs, getAverage } from '../../utilities';
import { textStyles } from '../../theme';

interface HoursDoneStatsProps {
  data: StatChartData;
}

export const HoursDoneStats: FunctionComponent<HoursDoneStatsProps> = ({ data }) => {
  const values = data.map(datum => datum.value ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = getAverage(...values);

  const msToHours = (ms: number) => ms / (1000 * 60 * 60);
  const dataInHours = data.map(datum => (
    {
      value: datum.value ? msToHours(datum.value) : null,
      label: datum.label,
    }));
  const minInHours = msToHours(min);
  const maxInHours = msToHours(max);
  const averageInHours = msToHours(average);

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
      <StatChart data={dataInHours} yAxisMin={minInHours} yAxisMax={maxInHours + 1} average={averageInHours} />

      <View style={styles.dataInText}>
        {renderDataInText(average, 'average')}
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
