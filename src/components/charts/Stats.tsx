import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
  BottomSheetItemPicker,
  Button,
  EmptyContainer,
  HoursDoneStats,
  PercentDoneStats,
  Section,
  StatChartData,
} from '..';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Icons } from '../../../assets';
import { StatsPeriodKeyType } from '../../store/settings/types';

export interface StatsProps {
  hasEnoughDataToShow7DaysStats: () => boolean;
  hasEnoughDataToShow30DaysStats: () => boolean;
  statsPeriodKey: '7' | '30';
  getTotalCompletedMsForLast7Days: () => StatChartData,
  getTotalCompletedMsForLast30Days: () => StatChartData,
  getTotalPercentDoneForLast7Days: () => StatChartData,
  getTotalPercentDoneForLast30Days: () => StatChartData,
  onStatsPeriodKeyChange?: (key: StatsPeriodKeyType) => void;
}

interface InternalData {
  loading: boolean;
  hasEnoughData: boolean;
  percentDoneStats: StatChartData | null;
  hoursDoneStats: StatChartData | null;
}

export const Stats: FunctionComponent<StatsProps> = ({
                                                       hasEnoughDataToShow7DaysStats,
                                                       hasEnoughDataToShow30DaysStats,
                                                       statsPeriodKey,
                                                       onStatsPeriodKeyChange,
                                                       getTotalCompletedMsForLast7Days,
                                                       getTotalCompletedMsForLast30Days,
                                                       getTotalPercentDoneForLast7Days,
                                                       getTotalPercentDoneForLast30Days,
                                                     }) => {
  const bottomSheetItemPickerRef = useRef<any>();


  const [data, setData] = useState<InternalData>({
    loading: true,
    hasEnoughData: false,
    percentDoneStats: null,
    hoursDoneStats: null,
  });

  useEffect(() => {
    let enoughData: boolean;
    let percentDoneStats: StatChartData, hoursDoneStats: StatChartData;

    if (statsPeriodKey === '7') {
      enoughData = hasEnoughDataToShow7DaysStats();
    } else {
      enoughData = hasEnoughDataToShow30DaysStats();
    }

    if (!enoughData) {
      setData({
        loading: false,
        hasEnoughData: false,
        percentDoneStats: null,
        hoursDoneStats: null,
      });

      return;
    }

    if (statsPeriodKey === '7') {
      percentDoneStats = getTotalPercentDoneForLast7Days();
      hoursDoneStats = getTotalCompletedMsForLast7Days();
    } else {
      percentDoneStats = getTotalPercentDoneForLast30Days();
      hoursDoneStats = getTotalCompletedMsForLast30Days();
    }

    setData({
      loading: false,
      hasEnoughData: true,
      percentDoneStats,
      hoursDoneStats,
    });
  }, [statsPeriodKey]);

  const statsPeriodChoices = [
    { key: '7', value: 'Last 7 Days' },
    { key: '30', value: 'Last 30 Days' },
  ];

  function selectedStatsPeriod(): { key: string, value: string } {
    return statsPeriodChoices.find(period => period.key === statsPeriodKey) || statsPeriodChoices[0];
  }

  const handleButtonPress = () => {
    bottomSheetItemPickerRef.current?.show();
  };

  const handleStatsPeriodValueChange = (value: { key: string, value: string }) => {
    onStatsPeriodKeyChange?.(value.key as StatsPeriodKeyType);
  };

  function renderStats() {
    if (!data.hasEnoughData) {
      const text = 'There isn\'t enough data to show statistics on yet. ' +
        'Keep using the app for a little while longer.';
      return <EmptyContainer text={text} style={styles.notEnoughData} />;
    }

    return (
      <>
        <Section title='% Done'>
          {statsPeriodKey === '7' && <PercentDoneStats data={data.percentDoneStats as StatChartData} />}
          {statsPeriodKey === '30' && <PercentDoneStats data={data.percentDoneStats as StatChartData} />}
        </Section>

        <Section title='Hours Tracked'>
          {statsPeriodKey === '7' && <HoursDoneStats data={data.hoursDoneStats as StatChartData} />}
          {statsPeriodKey === '30' && <HoursDoneStats data={data.hoursDoneStats as StatChartData} />}
        </Section>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Button title={selectedStatsPeriod().value} iconSource={Icons.dateSpan} style={styles.button}
              onPress={handleButtonPress} />

      {data.loading && <ActivityIndicator />}
      {!data.loading && renderStats()}

      <BottomSheetItemPicker ref={bottomSheetItemPickerRef} allValues={statsPeriodChoices}
                             initialValue={selectedStatsPeriod()} onValueChange={handleStatsPeriodValueChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexGrow: 1,
    width: '100%',
    paddingVertical: 20,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  notEnoughData: {
    marginHorizontal: 20,
  },
});
