import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Section } from '../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../containers';

export const GoalsScreen: NavigationScreenComponent = () => {
  return (
    <ScrollView>
      <Section title="Today's Stats">
        <TodaysStats />
      </Section>

      <Section title='Incomplete Goals'>
        <TodaysIncompleteGoals />
      </Section>

      <Section title='Completed Goals'>
        <TodaysCompletedGoals />
      </Section>
    </ScrollView>
  );
};
