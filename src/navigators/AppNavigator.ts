import { TrackGoalScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { MainNavigator } from './MainNavigator';
import { AddGoalModal } from './AddGoalModal';
import { EditGoalModal } from './EditGoalModal';
import { AddTimetableEntryModal } from './AddTimetableEntryModal';

export const AppNavigator = createStackNavigator({
  MainTabs: MainNavigator,
  AddGoal: AddGoalModal,
  EditGoal: EditGoalModal,
  AddTimetableEntry: AddTimetableEntryModal,
  TrackGoal: TrackGoalScreen,
}, {
  mode: 'modal',
  headerMode: 'none',
});
