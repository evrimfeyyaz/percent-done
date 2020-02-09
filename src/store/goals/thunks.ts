import { ActionCreator } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes, UPDATE_TRACKED_GOAL_START_TIMESTAMP, UpdateTrackedGoalStartTimestampAction } from './types';
import { TimetableEntry, TimetableEntryActionTypes } from '../timetableEntries/types';
import { getGoalById, getRemainingMs, getTimetableEntriesForGoal, isCompleted } from './selectors';
import { deleteTimetableEntry } from '../timetableEntries/actions';
import { isTimeTracked } from './utilities';
import { momentWithDeviceLocale, NavigationService } from '../../utilities';
import { editGoal, removeTrackedGoal, setTrackedGoal } from './actions';
import { getCurrentDate } from '../settings/selectors';
import { addTimetableEntry } from '../timetableEntries/thunks';
import { WithOptionalId } from '../../utilities/types';
import { cancelLocalNotification, scheduleLocalNotification } from '../../utilities/localNotifications';
import { setScheduledGoalCompletedNotificationId } from '../settings/actions';
import { SettingsActionTypes } from '../settings/types';

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

export const startGoalTracking: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes>> = (goalId: string) => {
  return (dispatch, getState) => {
    const startTimestamp = Date.now();

    const state = getState();
    scheduleGoalCompletedNotification(state, goalId, startTimestamp, dispatch);

    dispatch(setTrackedGoal(goalId, startTimestamp));
    NavigationService.navigate('TrackGoal', {});
  };
};

export const updateTrackedGoalStartTimestamp: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes>> = (startTimestamp: number) => {
  return (dispatch, getState) => {
    const state = getState();
    const goalId = state.goals.trackedGoal.id;

    if (goalId == null) {
      throw new Error('Goal ID cannot be null when updating the tracked goal start timestamp.');
    }

    cancelGoalCompletedNotification(state, dispatch);

    dispatch({
      type: UPDATE_TRACKED_GOAL_START_TIMESTAMP,
      startTimestamp,
    });

    scheduleGoalCompletedNotification(state, goalId, startTimestamp, dispatch);
  };
};

export const stopGoalTracking: ActionCreator<ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes>> = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { startTimestamp, id: goalId, projectId } = state.goals.trackedGoal;
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
    cancelGoalCompletedNotification(state, dispatch);
  };
};

function scheduleGoalCompletedNotification(state: StoreState, goalId: string, startTimestamp: number, dispatch: ThunkDispatch<any, any, any>) {
  const today = new Date();
  const goal = getGoalById(state, goalId);

  let remainingMs = getRemainingMs(state, goal, today);
  if (remainingMs == null || remainingMs <= 0) return;

  let willBeCompletedAt = momentWithDeviceLocale(startTimestamp + remainingMs);

  if (willBeCompletedAt.isAfter(today, 'day')) {
    remainingMs = getRemainingMs(state, goal, willBeCompletedAt.toDate());
    if (remainingMs == null) return;

    willBeCompletedAt = willBeCompletedAt.startOf('day').add(remainingMs, 'ms');
  }

  const notificationId = scheduleLocalNotification(`${goal.title} is completed. Great job!`, willBeCompletedAt.toDate());

  dispatch(setScheduledGoalCompletedNotificationId(notificationId));
}

function cancelGoalCompletedNotification(state: StoreState, dispatch: ThunkDispatch<any, any, any>) {
  const notificationId = state.settings.scheduledGoalCompletedNotificationId;

  if (notificationId != null) {
    cancelLocalNotification(notificationId);
    dispatch(setScheduledGoalCompletedNotificationId(undefined));
  }
}
