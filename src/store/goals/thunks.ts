import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes, UPDATE_TRACKED_GOAL_START_TIMESTAMP } from './types';
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
import {
  setScheduledBreakNotificationId,
  setScheduledGoalCompletedNotificationId,
  setShouldTakeBreak,
} from '../settings/actions';
import { SettingsActionTypes } from '../settings/types';

export const handleCompleteOrTrackRequest = (goalId: string): ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes> => {
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

export const startGoalTracking = (goalId: string): ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes> => {
  return (dispatch, getState) => {
    const startTimestamp = Date.now();

    const state = getState();
    scheduleGoalCompletedNotification(state, goalId, startTimestamp, dispatch);

    scheduleBreakNotification(state, startTimestamp, dispatch);

    dispatch(setTrackedGoal(goalId, startTimestamp));
    NavigationService.navigate('TrackGoal', {});
  };
};

export const updateTrackedGoalStartTimestamp = (startTimestamp: number): ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes> => {
  return (dispatch, getState) => {
    const state = getState();
    const goalId = state.goals.trackedGoal.id;

    if (goalId == null) {
      throw new Error('Goal ID cannot be null when updating the tracked goal start timestamp.');
    }

    cancelGoalCompletedNotification(state, dispatch);
    cancelBreakNotification(state, dispatch);

    dispatch({
      type: UPDATE_TRACKED_GOAL_START_TIMESTAMP,
      startTimestamp,
    });

    scheduleGoalCompletedNotification(state, goalId, startTimestamp, dispatch);
    scheduleBreakNotification(state, startTimestamp, dispatch);
  };
};

export const stopGoalTracking = (): ThunkAction<void, StoreState, void, GoalActionTypes | TimetableEntryActionTypes | SettingsActionTypes> => {
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
    dispatch(setShouldTakeBreak(false));

    cancelGoalCompletedNotification(state, dispatch);
    cancelBreakNotification(state, dispatch);
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

  const notificationId = scheduleLocalNotification(`Your goal is completed. Great job!`, willBeCompletedAt.toDate(), 'goal-completed-channel', goal.title);

  dispatch(setScheduledGoalCompletedNotificationId(notificationId));
}

function scheduleBreakNotification(state: StoreState, startTimestamp: number, dispatch: ThunkDispatch<any, any, any>) {
  const { notifyBreakAfterInMs, areBreakNotificationsOn } = state.settings;

  if (!areBreakNotificationsOn) {
    return;
  }

  const breakAt = momentWithDeviceLocale(startTimestamp).add(notifyBreakAfterInMs, 'ms').toDate();
  const notificationId = scheduleLocalNotification('Time to take a break.', breakAt, 'break-channel');

  dispatch(setScheduledBreakNotificationId(notificationId));
}

function cancelGoalCompletedNotification(state: StoreState, dispatch: ThunkDispatch<any, any, any>) {
  const notificationId = state.settings.scheduledGoalCompletedNotificationId;

  if (notificationId != null) {
    cancelLocalNotification(notificationId);
    dispatch(setScheduledGoalCompletedNotificationId(undefined));
  }
}

function cancelBreakNotification(state: StoreState, dispatch: ThunkDispatch<any, any, any>) {
  const notificationId = state.settings.scheduledBreakNotificationId;

  if (notificationId != null) {
    cancelLocalNotification(notificationId);
    dispatch(setScheduledBreakNotificationId(undefined));
  }
}
