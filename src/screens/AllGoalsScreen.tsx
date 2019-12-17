import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleRightActionPress = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  return <AllGoals onRightActionPress={handleRightActionPress} />;
};
