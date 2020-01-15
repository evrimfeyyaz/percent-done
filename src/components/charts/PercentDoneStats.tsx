import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatChart, StatChartData } from '..';
import { getMedian } from '../../utilities';
import { textStyles } from '../../theme';

export interface PercentDoneStatsProps {
  data: StatChartData;
}

export const PercentDoneStats: FunctionComponent<PercentDoneStatsProps> = ({ data }) => {
  const values = data.map(datum => datum.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const median = getMedian(values);

  function renderDataInText(value: number, text: string) {
    return (
      <Text style={textStyles.info}>
        {value}
        <Text style={textStyles.infoLabel}>%</Text>
        <Text style={textStyles.infoTail}> {text}</Text>
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <StatChart data={data} min={0} max={100} median={median} />

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
