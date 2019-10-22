import { StatsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';

export const StatsTab = createStackNavigator({
  Stats: StatsScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
