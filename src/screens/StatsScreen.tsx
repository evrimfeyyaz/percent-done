import React, { useRef, useState } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BottomSheetItemPicker, Button, EmptyContainer, Section } from '../components';
import {
  MonthlyHoursDoneStats,
  MonthlyPercentDoneStats,
  WeeklyHoursDoneStats,
  WeeklyPercentDoneStats,
} from '../containers';
import { ScrollView, StyleSheet } from 'react-native';
import { Icons } from '../../assets';
import { useStore } from 'react-redux';
import { isThereEnoughDataToShowStatisticsOfLastNDays } from '../store/goals/selectors';

export const StatsScreen: NavigationStackScreenComponent = () => {
  const state = useStore().getState();
  const hasEnoughDataToShow7DaysStats = isThereEnoughDataToShowStatisticsOfLastNDays(state, 7, 2);
  const hasEnoughDataToShow30DaysStats = isThereEnoughDataToShowStatisticsOfLastNDays(state, 30, 9);

  const bottomSheetItemPickerRef = useRef<any>();
  const [statsPeriodKey, setStatsPeriodKey] = useState('7');

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
    setStatsPeriodKey(value.key);
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
          {statsPeriodKey === '7' && (<WeeklyPercentDoneStats />)}
          {statsPeriodKey === '30' && (<MonthlyPercentDoneStats />)}
        </Section>

        <Section title='Hours Tracked'>
          {statsPeriodKey === '7' && (<WeeklyHoursDoneStats />)}
          {statsPeriodKey === '30' && (<MonthlyHoursDoneStats />)}
        </Section>
      </>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <Button title={selectedStatsPeriod().value} iconSource={Icons.dateSpan} style={styles.button}
              onPress={handleButtonPress} />

      {renderStats()}

      <BottomSheetItemPicker ref={bottomSheetItemPickerRef} allValues={statsPeriodChoices}
                             initialValue={selectedStatsPeriod()} onValueChange={handleStatsPeriodValueChange} />
    </ScrollView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'stretch',
    flexGrow: 1,
  },
  button: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  notEnoughData: {
    marginHorizontal: 20,
  }
});
