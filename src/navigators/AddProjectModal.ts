import { AddProjectScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const AddProjectModal = createStackNavigator({
  AddProject: AddProjectScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
