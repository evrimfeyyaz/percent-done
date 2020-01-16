import React, { useRef, useState } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BottomSheetItemPicker, Button, Section } from '../components';
import {
  MonthlyHoursDoneStats,
  MonthlyPercentDoneStats,
  WeeklyHoursDoneStats,
  WeeklyPercentDoneStats,
} from '../containers';
import { ScrollView, StyleSheet } from 'react-native';
import { Icons } from '../../assets';

export const StatsScreen: NavigationStackScreenComponent = () => {
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

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Button title={selectedStatsPeriod().value} iconSource={Icons.dateSpan} style={styles.button}
              onPress={handleButtonPress} />

      <Section title='% Done'>
        {statsPeriodKey === '7' && (<WeeklyPercentDoneStats />)}
        {statsPeriodKey === '30' && (<MonthlyPercentDoneStats />)}
      </Section>

      <Section title='Hours Done'>
        {statsPeriodKey === '7' && (<WeeklyHoursDoneStats />)}
        {statsPeriodKey === '30' && (<MonthlyHoursDoneStats />)}
      </Section>

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
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
});
