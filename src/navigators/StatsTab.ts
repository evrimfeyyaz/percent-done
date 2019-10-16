import React from 'react';
import { StatsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';

export const StatsTab = createStackNavigator({
  Stats: StatsScreen,
});
