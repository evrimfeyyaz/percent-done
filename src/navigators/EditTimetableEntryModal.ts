import { EditTimetableEntryScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

export const EditTimetableEntryModal = createStackNavigator({
  EditTimetableEntry: EditTimetableEntryScreen,
}, {
  defaultNavigationOptions: { ...headerConfig },
});
