import React from 'react';
import { SettingsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';

export const SettingsTab = createStackNavigator({
  Settings: SettingsScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
