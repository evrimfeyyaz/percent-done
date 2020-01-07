import { EditProjectScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const EditProjectModal = createStackNavigator({
  EditProject: EditProjectScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
