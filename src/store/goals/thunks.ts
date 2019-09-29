import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from './types';
import { TimetableEntry, TimetableEntryActionTypes } from '../timetableEntries/types';
import { getGoalById, getTimetableEntriesForGoal, isCompleted } from './selectors';
import { createRandomId } from '../../utilities/createRandomId';
import { addTimetableEntry, removeTimetableEntry } from '../timetableEntries/actions';
import { isTimeTracked } from './utilities';

export const handleGoalSwipe: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = (goalId: string) => {
  return (dispatch, getState) => {
    const state = getState();
    const goal = getGoalById(state, goalId);

    if (goal == null) throw Error('Can\'t find goal.');

    if (isTimeTracked(goal)) {

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
