import { EditGoalScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const EditGoalModal = createStackNavigator({
  EditGoal: EditGoalScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
