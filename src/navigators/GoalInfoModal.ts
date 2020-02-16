import { GoalInfoScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const GoalInfoModal = createStackNavigator({
  GoalInfo: GoalInfoScreen
}, {
  defaultNavigationOptions: { ...headerConfig },
});
