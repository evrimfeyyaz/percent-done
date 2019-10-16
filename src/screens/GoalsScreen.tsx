import React from 'react';
import { ScrollView } from 'react-native';
import { Section } from '../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../containers';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';

export const GoalsScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <ScrollView>
      <Section title="Today's Stats">
        {/*
         // @ts-ignore */}
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
