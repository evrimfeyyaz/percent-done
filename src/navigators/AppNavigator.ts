import { TrackGoalScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { MainNavigator } from './MainNavigator';
import { AddGoalModal } from './AddGoalModal';
import { EditGoalModal } from './EditGoalModal';
import { AddTimetableEntryModal } from './AddTimetableEntryModal';
import { EditTimetableEntryModal } from './EditTimetableEntryModal';
import { EditProjectModal } from './EditProjectModal';

export const AppNavigator = createStackNavigator({
  MainTabs: MainNavigator,
  AddGoal: AddGoalModal,
  EditGoal: EditGoalModal,
  EditProjectModal: EditProjectModal,
  AddTimetableEntry: AddTimetableEntryModal,
  EditTimetableEntry: EditTimetableEntryModal,
  TrackGoal: TrackGoalScreen,
}, {
  mode: 'modal',
  headerMode: 'none',
});
