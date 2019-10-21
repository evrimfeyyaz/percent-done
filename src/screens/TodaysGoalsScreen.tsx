import React from 'react';
import { ScrollView } from 'react-native';
import { HeaderButton, HeaderCancelButton, Section } from '../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../containers';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { AddGoalScreen } from './AddGoalScreen';

export const TodaysGoalsScreen: NavigationMaterialTabScreenComponent = () => {
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

TodaysGoalsScreen.navigationOptions = {
  title: 'Goals',
};
