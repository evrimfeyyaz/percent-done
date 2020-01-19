import React from 'react';
import { StoreState } from '../store/types';
import {
  convertGoalsToGoalRowProps,
  getCompleteGoals, getIncompleteGoals,
  getTotalCompletedMsForDate,
  getTotalProgressForDate,
  getTotalRemainingMsForDate,
} from '../store/goals/selectors';
import { DayDetails, DayDetailsProps } from '../components';
import { convertTimetableEntriesToTimetableRows, getTimetableEntriesByDate } from '../store/timetableEntries/selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationService } from '../utilities';
import { setTimeMachineDateTimestamp } from '../store/settings/actions';
import { SettingsActionTypes } from '../store/settings/types';

const mapStateToProps = (state: StoreState): DayDetailsProps => {
  const date = new Date(state.settings.timeMachineDateTimestamp ?? Date.now());

  return {
    date: date,
    percentDone: getTotalProgressForDate(state, date),
    completedMs: getTotalCompletedMsForDate(state, date),
    remainingMs: getTotalRemainingMsForDate(state, date),
    completedGoals: convertGoalsToGoalRowProps(state, getCompleteGoals(state, date), date),
    incompleteGoals: convertGoalsToGoalRowProps(state, getIncompleteGoals(state, date), date),
    entries: convertTimetableEntriesToTimetableRows(state, getTimetableEntriesByDate(state, date)),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<SettingsActionTypes>): Partial<DayDetailsProps> => ({
  onEditActionInteraction: (goalId?: string) => NavigationService.navigate('EditGoal', { goalId }),
  onEntryPress: (entryId: string) => NavigationService.navigate('EditTimetableEntry', { entryId }),
  onDateChange: (date: Date) => dispatch(setTimeMachineDateTimestamp(date.getTime())),
});

export const TimeMachine = connect(mapStateToProps, mapDispatchToProps)(DayDetails);
