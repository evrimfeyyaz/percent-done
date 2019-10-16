import React from 'react';
import { TrackGoalScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { MainNavigator } from './MainNavigator';
import { AddGoalModal } from './AddGoalModal';

export const AppNavigator = createStackNavigator({
  MainTabs: MainNavigator,
  AddGoal: AddGoalModal,
  TrackGoal: TrackGoalScreen,
}, {
  mode: 'modal',
  headerMode: 'none',
});
