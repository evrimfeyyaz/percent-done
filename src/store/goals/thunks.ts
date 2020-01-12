import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from './types';
import { TimetableEntry, TimetableEntryActionTypes } from '../timetableEntries/types';
import { getGoalById, getTimetableEntriesForGoal, isCompleted } from './selectors';
import { deleteTimetableEntry } from '../timetableEntries/actions';
import { isTimeTracked } from './utilities';
import { NavigationService } from '../../utilities';
import { editGoal, removeTrackedGoal, setTrackedGoal } from './actions';
import { getCurrentDate } from '../settings/selectors';
import { addTimetableEntry } from '../timetableEntries/thunks';
import { WithOptionalId } from '../../utilities/types';

export const handleCompleteOrTrackRequest: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = (goalId: string) => {
  return (dispatch, getState) => {
    const state = getState();
    const goal = getGoalById(state, goalId);

    if (goal == null) throw new Error('Can\'t find goal.');

    if (isTimeTracked(goal)) {
      dispatch(startGoalTracking(goal.id));
    } else {
      const currentDate = getCurrentDate(state);

      if (isCompleted(state, goal, currentDate)) {
        const todaysTimetableEntries = getTimetableEntriesForGoal(state, goal, currentDate);

        todaysTimetableEntries.forEach(entry => dispatch(deleteTimetableEntry(entry)));
      } else {
        const timestamp = Date.now();

        const timetableEntry: WithOptionalId<TimetableEntry> = {
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

export const stopGoalTracking: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes>> = () => {
  return (dispatch, getState) => {
    const { startTimestamp, id: goalId, projectId } = getState().goals.trackedGoal;
    const endTimestamp = Date.now();

    if (startTimestamp == null || goalId == null) {
      throw new Error('Tracked goal data is corrupt.');
    }

    dispatch(removeTrackedGoal());

    const timetableEntry: WithOptionalId<TimetableEntry> = {
      goalId,
      startTimestamp,
      endTimestamp,
      projectId,
    };

    dispatch(addTimetableEntry(timetableEntry));

    const goal = getGoalById(getState(), goalId);
    goal.lastProjectId = projectId;

    dispatch(editGoal(goal));
  };
};
