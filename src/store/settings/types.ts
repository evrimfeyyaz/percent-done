import { Action } from 'redux';

export type StatsPeriodKeyType = '7' | '30';

export interface SettingsState {
  currentDateTimestamp?: number;
  timeMachineDateTimestamp: number;
  /**
   * The key for the selected stats period
   * on the stats screen.
   */
  statsPeriodKey: StatsPeriodKeyType;
  hasOnboarded: boolean;
  scheduledGoalCompletedNotificationId?: string;
  areBreakNotificationsOn: boolean;
  notifyBreakAfterInMs: number;
}

export const SET_CURRENT_DATE_TIMESTAMP = 'SET_CURRENT_DATE_TIMESTAMP';
export const SET_TIME_MACHINE_DATE_TIMESTAMP = 'SET_TIME_MACHINE_DATE_TIMESTAMP';
export const SET_STATS_PERIOD_KEY = 'SET_STATS_PERIOD_KEY';
export const SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID = 'SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID';
export const SET_ONBOARDED = 'SET_ONBOARDED';
export const SET_ARE_BREAK_NOTIFICATIONS_ON = 'SET_ARE_BREAK_NOTIFICATIONS_ON';
export const SET_NOTIFY_BREAK_AFTER_IN_MS = 'SET_NOTIFY_BREAK_AFTER_IN_MS';

export interface SetCurrentDateTimestampAction extends Action<typeof SET_CURRENT_DATE_TIMESTAMP> {
  timestamp: number;
}

export interface SetTimeMachineDateTimestampAction extends Action<typeof SET_TIME_MACHINE_DATE_TIMESTAMP> {
  timestamp: number;
}

export interface SetStatsPeriodKeyAction extends Action<typeof SET_STATS_PERIOD_KEY> {
  key: StatsPeriodKeyType;
}

export interface SetScheduledGoalCompletedNotificationIdAction extends Action<typeof SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID> {
  id: string | undefined;
}

export interface SetOnboardedAction extends Action<typeof SET_ONBOARDED> {
  hasOnboarded: boolean;
}

export interface SetAreBreakNotificationsOnAction extends Action<typeof SET_ARE_BREAK_NOTIFICATIONS_ON> {
  areBreakNotificationsOn: boolean;
}

export interface SetNotifyBreakAfterInMsAction extends Action<typeof SET_NOTIFY_BREAK_AFTER_IN_MS> {
  notifyBreakAfterInMs: number;
}

export type SettingsActionTypes =
  SetCurrentDateTimestampAction |
  SetTimeMachineDateTimestampAction |
  SetStatsPeriodKeyAction |
  SetScheduledGoalCompletedNotificationIdAction |
  SetOnboardedAction |
  SetAreBreakNotificationsOnAction |
  SetNotifyBreakAfterInMsAction;
