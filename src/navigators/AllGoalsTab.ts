import { AllGoalsScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';

export const AllGoalsTab = createStackNavigator({
  AllGoals: AllGoalsScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
  navigationOptions: {
    tabBarLabel: 'All Goals'
  }
});
