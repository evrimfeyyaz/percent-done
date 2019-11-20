import { AddTimetableEntryScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const AddTimetableEntryModal = createStackNavigator({
  AddTimetableEntry: AddTimetableEntryScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
