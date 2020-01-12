import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ListHeader } from '../components';
import { textStyles } from '../theme';
import { Icons } from '../../assets';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleEditActionInteraction = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  const handleAddButtonPress = () => {
    navigation.navigate('AddGoal');
  };

  const description = 'Goals are tasks you would like to track day by day, ' +
    'such as "writing for an hour every day" or "exercising Monday to Friday."';

  return (
    <>
      <ListHeader
        buttonTitle='Add Goal'
        buttonIconSource={Icons.goal}
        onButtonPress={handleAddButtonPress}
        description={description}
      />
      <AllGoals onEditActionInteraction={handleEditActionInteraction} />
    </>
  );
};
