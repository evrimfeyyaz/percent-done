import React from 'react';
import { TomorrowScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';

export const TomorrowTab = createStackNavigator({
  Tomorrow: TomorrowScreen,
});
