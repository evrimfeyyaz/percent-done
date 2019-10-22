import React from 'react';
import { ScrollView } from 'react-native';
import { Section } from '../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../containers';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';

export const TodaysGoalsScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  const handleRightActionPress = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  return (
    <ScrollView>
      <Section title="Today's Stats">
        <TodaysStats />
      </Section>

      <Section title='Incomplete Goals'>
        <TodaysIncompleteGoals onRightActionPress={handleRightActionPress} />
      </Section>

      <Section title='Completed Goals'>
        <TodaysCompletedGoals onRightActionPress={handleRightActionPress} />
      </Section>
    </ScrollView>
  );
};

TodaysGoalsScreen.navigationOptions = {
  title: 'Goals',
};
