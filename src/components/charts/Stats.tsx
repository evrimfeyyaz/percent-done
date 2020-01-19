import React, { FunctionComponent, useRef } from 'react';
import {
  BottomSheetItemPicker,
  Button,
  EmptyContainer,
  HoursDoneStats,
  PercentDoneStats,
  Section,
  StatChartData,
} from '..';
import { StyleSheet, View } from 'react-native';
import { Icons } from '../../../assets';
import { StatsPeriodKeyType } from '../../store/settings/types';

export interface StatsProps {
  hasEnoughDataToShow7DaysStats: boolean;
  hasEnoughDataToShow30DaysStats: boolean;
  /**
   * Either '7' or '30'.
   */
  statsPeriodKey: string;
  totalCompletedMsForLast7Days: StatChartData,
  totalCompletedMsForLast30Days: StatChartData,
  totalPercentDoneForLast7Days: StatChartData,
  totalPercentDoneForLast30Days: StatChartData,
  onStatsPeriodKeyChange?: (key: StatsPeriodKeyType) => void;
}

export const Stats: FunctionComponent<StatsProps> = ({
                                                       hasEnoughDataToShow7DaysStats,
                                                       hasEnoughDataToShow30DaysStats,
                                                       statsPeriodKey,
                                                       onStatsPeriodKeyChange,
                                                       totalCompletedMsForLast7Days,
                                                       totalCompletedMsForLast30Days,
                                                       totalPercentDoneForLast7Days,
                                                       totalPercentDoneForLast30Days,
                                                     }) => {
  const bottomSheetItemPickerRef = useRef<any>();

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
    if (
      (statsPeriodKey === '7' && !hasEnoughDataToShow7DaysStats) ||
      (statsPeriodKey === '30' && !hasEnoughDataToShow30DaysStats)
    ) {
      const text = 'There isn\'t enough data to show these statistics yet. ' +
        'Keep using the app for a little while longer to see them.';
      return <EmptyContainer text={text} style={styles.notEnoughData} />;
    }

    return (
      <>
        <Section title='% Done'>
          {statsPeriodKey === '7' && (<PercentDoneStats data={totalPercentDoneForLast7Days} />)}
          {statsPeriodKey === '30' && (<PercentDoneStats data={totalPercentDoneForLast30Days} />)}
        </Section>

        <Section title='Hours Tracked'>
          {statsPeriodKey === '7' && (<HoursDoneStats data={totalCompletedMsForLast7Days} />)}
          {statsPeriodKey === '30' && (<HoursDoneStats data={totalCompletedMsForLast30Days} />)}
        </Section>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Button title={selectedStatsPeriod().value} iconSource={Icons.dateSpan} style={styles.button}
              onPress={handleButtonPress} />

      {renderStats()}

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
  },
  button: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  notEnoughData: {
    marginHorizontal: 20,
  },
});
