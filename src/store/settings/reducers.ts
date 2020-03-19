import {
  SET_ARE_BREAK_NOTIFICATIONS_ON,
  SET_CURRENT_DATE_TIMESTAMP,
  SET_NOTIFY_BREAK_AFTER_IN_MS,
  SET_ONBOARDED,
  SET_SCHEDULED_BREAK_NOTIFICATION_ID,
  SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
  SET_STATS_PERIOD_KEY,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SET_USER,
  SettingsActionTypes,
  SettingsState,
} from './types';
import { Reducer } from 'redux';

const initialState: SettingsState = {
  timeMachineDateTimestamp: Date.now(),
  statsPeriodKey: '7',
  hasOnboarded: false,
  areBreakNotificationsOn: false,
  notifyBreakAfterInMs: 25 * 60 * 1000,
};

export const settingsReducer: Reducer<SettingsState, SettingsActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_DATE_TIMESTAMP:
      return { ...state, currentDateTimestamp: action.timestamp };
    case SET_TIME_MACHINE_DATE_TIMESTAMP:
      return { ...state, timeMachineDateTimestamp: action.timestamp };
    case SET_STATS_PERIOD_KEY:
      return { ...state, statsPeriodKey: action.key };
    case SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID:
      return { ...state, scheduledGoalCompletedNotificationId: action.id };
    case SET_ONBOARDED:
      return { ...state, hasOnboarded: action.hasOnboarded };
    case SET_ARE_BREAK_NOTIFICATIONS_ON:
      return { ...state, areBreakNotificationsOn: action.areBreakNotificationsOn };
    case SET_NOTIFY_BREAK_AFTER_IN_MS:
      return { ...state, notifyBreakAfterInMs: action.notifyBreakAfterInMs };
    case SET_SCHEDULED_BREAK_NOTIFICATION_ID:
      return { ...state, scheduledBreakNotificationId: action.id };
    case SET_USER:
      return { ...state, user: action.user };
    default:
      return state;
  }
};
