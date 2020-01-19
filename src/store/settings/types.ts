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
}

export const SET_CURRENT_DATE_TIMESTAMP = 'SET_CURRENT_DATE_TIMESTAMP';
export const SET_TIME_MACHINE_DATE_TIMESTAMP = 'SET_TIME_MACHINE_DATE_TIMESTAMP';
export const SET_STATS_PERIOD_KEY = 'SET_STATS_PERIOD_KEY';

export interface SetCurrentDateTimestampAction extends Action<typeof SET_CURRENT_DATE_TIMESTAMP> {
  timestamp: number;
}

export interface SetTimeMachineDateTimestampAction extends Action<typeof SET_TIME_MACHINE_DATE_TIMESTAMP> {
  timestamp: number;
}

export interface SetStatsPeriodKeyAction extends Action<typeof SET_STATS_PERIOD_KEY> {
  key: StatsPeriodKeyType;
}

export type SettingsActionTypes =
  SetCurrentDateTimestampAction |
  SetTimeMachineDateTimestampAction |
  SetStatsPeriodKeyAction;
