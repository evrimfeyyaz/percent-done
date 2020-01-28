import {
  SET_CURRENT_DATE_TIMESTAMP,
  SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
  SET_STATS_PERIOD_KEY,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SettingsActionTypes,
  SettingsState,
} from './types';
import { Reducer } from 'redux';

const initialState: SettingsState = {
  timeMachineDateTimestamp: Date.now(),
  statsPeriodKey: '7',
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
    default:
      return state;
  }
};
