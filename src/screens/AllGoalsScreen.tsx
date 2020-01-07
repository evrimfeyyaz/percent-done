import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleEditActionInteraction = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  return <AllGoals onEditActionInteraction={handleEditActionInteraction} />;
};
