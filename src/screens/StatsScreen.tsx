import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { Section } from '../components';
import { WeeklyHoursDoneStats, WeeklyPercentDoneStats } from '../containers';
import { ScrollView } from 'react-native';

export const StatsScreen: NavigationStackScreenComponent = () => {
  return (
    <ScrollView>
      <Section title='% Done'>
        <WeeklyPercentDoneStats />
      </Section>

      <Section title='Hours Done'>
        <WeeklyHoursDoneStats />
      </Section>
    </ScrollView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};
