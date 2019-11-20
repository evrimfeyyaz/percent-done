import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from './types';
import { TimetableEntry, TimetableEntryActionTypes } from '../timetableEntries/types';
import { getGoalById, getTimetableEntriesForGoal, isCompleted } from './selectors';
import { addTimetableEntry, removeTimetableEntry } from '../timetableEntries/actions';
import { isTimeTracked } from './utilities';
import { NavigationService, createRandomId } from '../../utilities';
import { removeTrackedGoal, setTrackedGoal } from './actions';

export const handleGoalSwipe: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = (goalId: string) => {
  return (dispatch, getState) => {
    const state = getState();
    const goal = getGoalById(state, goalId);

    if (goal == null) throw new Error('Can\'t find goal.');

    if (isTimeTracked(goal)) {
      dispatch(startGoalTracking(goal.id));
    } else {
      const today = new Date();

      if (isCompleted(state, goal, today)) {
        const todaysTimetableEntries = getTimetableEntriesForGoal(state, goal, today);

        todaysTimetableEntries.forEach(entry => dispatch(removeTimetableEntry(entry)));
      } else {
        const timestamp = Date.now();

        const timetableEntry: TimetableEntry = {
          id: createRandomId(),
          goalId,
          startTimestamp: timestamp,
          endTimestamp: timestamp,
        };

        dispatch(addTimetableEntry(timetableEntry));
      }
    }
  };
};

export const startGoalTracking: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = (goalId: string) => {
  return (dispatch) => {
    const startTimestamp = Date.now();

    dispatch(setTrackedGoal(goalId, startTimestamp));
    NavigationService.navigate('TrackGoal', {});
  };
};

export const stopGoalTracking: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = (endTimestamp: number) => {
  return (dispatch, getState) => {
    const { startTimestamp, id: goalId } = getState().goals.trackedGoal;

    if (startTimestamp == null || goalId == null) {
      throw new Error('Tracked goal data is corrupt.');
    }

    NavigationService.goBack();
    dispatch(removeTrackedGoal());

    // TODO: Handle the case where the start and end timestamps spawn multiple days.
    const timetableEntry: TimetableEntry = {
      id: createRandomId(),
      goalId,
      startTimestamp,
      endTimestamp,
    };

    dispatch(addTimetableEntry(timetableEntry));
  };
};
