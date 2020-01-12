import { Action } from 'redux';

export interface SettingsState {
  currentDateTimestamp?: number;
}

export const SET_CURRENT_DATE_TIMESTAMP = 'SET_CURRENT_DATE_TIMESTAMP';

export interface SetCurrentDateTimestampAction extends Action<typeof SET_CURRENT_DATE_TIMESTAMP> {
  timestamp: number;
}

export type SettingsActionTypes = SetCurrentDateTimestampAction;
