import {
  SET_ARE_BREAK_NOTIFICATIONS_ON,
  SET_CURRENT_DATE_TIMESTAMP,
  SET_NOTIFY_BREAK_AFTER_IN_MS,
  SET_ONBOARDED,
  SET_SCHEDULED_BREAK_NOTIFICATION_ID,
  SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
  SET_SHOULD_TAKE_BREAK,
  SET_STATS_PERIOD_KEY,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SET_USER,
  SetAreBreakNotificationsOnAction,
  SetCurrentDateTimestampAction,
  SetNotifyBreakAfterInMsAction,
  SetOnboardedAction,
  SetScheduledBreakNotificationIdAction,
  SetScheduledGoalCompletedNotificationIdAction,
  SetShouldTakeBreakAction,
  SetStatsPeriodKeyAction,
  SetTimeMachineDateTimestampAction,
  SetUserAction,
  StatsPeriodKeyType,
  User,
} from './types';

export const setCurrentDateTimestamp = (timestamp: number): SetCurrentDateTimestampAction => ({
  type: SET_CURRENT_DATE_TIMESTAMP,
  timestamp,
});

export const setTimeMachineDateTimestamp = (timestamp: number): SetTimeMachineDateTimestampAction => ({
  type: SET_TIME_MACHINE_DATE_TIMESTAMP,
  timestamp,
});

export const setStatsPeriodKey = (key: StatsPeriodKeyType): SetStatsPeriodKeyAction => ({
  type: SET_STATS_PERIOD_KEY,
  key,
});

export const setScheduledGoalCompletedNotificationId = (id: string | undefined): SetScheduledGoalCompletedNotificationIdAction => ({
  type: SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID,
  id,
});

export const setOnboarded = (hasOnboarded: boolean): SetOnboardedAction => ({
  type: SET_ONBOARDED,
  hasOnboarded,
});

export const setAreBreakNotificationsOn = (areBreakNotificationsOn: boolean): SetAreBreakNotificationsOnAction => ({
  type: SET_ARE_BREAK_NOTIFICATIONS_ON,
  areBreakNotificationsOn,
});

export const setNotifyBreakAfterInMs = (notifyBreakAfterInMs: number): SetNotifyBreakAfterInMsAction => ({
  type: SET_NOTIFY_BREAK_AFTER_IN_MS,
  notifyBreakAfterInMs,
});

export const setScheduledBreakNotificationId = (id: string | undefined): SetScheduledBreakNotificationIdAction => ({
  type: SET_SCHEDULED_BREAK_NOTIFICATION_ID,
  id,
});

export const setUser = (user?: User): SetUserAction => ({
  type: SET_USER,
  user,
});

export const setShouldTakeBreak = (shouldTakeBreak: boolean): SetShouldTakeBreakAction => ({
  type: SET_SHOULD_TAKE_BREAK,
  shouldTakeBreak,
});
