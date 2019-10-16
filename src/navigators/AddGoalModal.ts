import React from 'react';
import { AddGoalScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const AddGoalModal = createStackNavigator({
  AddGoal: AddGoalScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
