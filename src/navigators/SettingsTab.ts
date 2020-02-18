import { SettingsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';
import { LicensesScreen } from '../screens/settings/LicensesScreen';
import { LicenseScreen } from '../screens/settings/LicenseScreen';
import { AboutScreen } from '../screens/settings/AboutScreen';

export const SettingsTab = createStackNavigator({
  Settings: SettingsScreen,
  Licenses: LicensesScreen,
  License: LicenseScreen,
  About: AboutScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
