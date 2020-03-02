import {
  SET_ARE_BREAK_NOTIFICATIONS_ON,
  SET_CURRENT_DATE_TIMESTAMP,
  SET_NOTIFY_BREAK_AFTER_IN_MS,
  SET_ONBOARDED,
  SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
  SET_STATS_PERIOD_KEY,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SetAreBreakNotificationsOnAction,
  SetCurrentDateTimestampAction,
  SetNotifyBreakAfterInMsAction,
  SetOnboardedAction,
  SetScheduledGoalCompletedNotificationIdAction,
  SetStatsPeriodKeyAction,
  SetTimeMachineDateTimestampAction,
  StatsPeriodKeyType,
} from './types';

export const setCurrentDateTimestamp = (timestamp: number): SetCurrentDateTimestampAction => {
  return {
    type: SET_CURRENT_DATE_TIMESTAMP,
    timestamp,
  };
};

export const setTimeMachineDateTimestamp = (timestamp: number): SetTimeMachineDateTimestampAction => {
  return {
    type: SET_TIME_MACHINE_DATE_TIMESTAMP,
    timestamp,
  };
};

export const setStatsPeriodKey = (key: StatsPeriodKeyType): SetStatsPeriodKeyAction => {
  return {
    type: SET_STATS_PERIOD_KEY,
    key,
  };
};

export const setScheduledGoalCompletedNotificationId = (id: string | undefined): SetScheduledGoalCompletedNotificationIdAction => {
  return {
    type: SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
    id,
  };
};

export const setOnboarded = (hasOnboarded: boolean): SetOnboardedAction => {
  return {
    type: SET_ONBOARDED,
    hasOnboarded,
  };
};

export const setAreBreakNotificationsOn = (areBreakNotificationsOn: boolean): SetAreBreakNotificationsOnAction => {
  return {
    type: SET_ARE_BREAK_NOTIFICATIONS_ON,
    areBreakNotificationsOn,
  };
};

export const setNotifyBreakAfterInMs = (notifyBreakAfterInMs: number): SetNotifyBreakAfterInMsAction => {
  return {
    type: SET_NOTIFY_BREAK_AFTER_IN_MS,
    notifyBreakAfterInMs,
  };
};

