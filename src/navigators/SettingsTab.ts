import React from 'react';
import { SettingsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';

export const SettingsTab = createStackNavigator({
  Settings: SettingsScreen,
});
