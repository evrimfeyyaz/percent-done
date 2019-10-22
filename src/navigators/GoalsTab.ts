import { GoalsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';

export const GoalsTab = createStackNavigator({
  Goals: GoalsScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
