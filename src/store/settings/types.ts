import { Action } from 'redux';

export interface SettingsState {
  currentDateTimestamp?: number;
}

export const SET_CURRENT_DATE = 'SET_CURRENT_DATE';

export interface SetCurrentDateAction extends Action<typeof SET_CURRENT_DATE> {
  date: Date;
}

export type SettingsActionTypes = SetCurrentDateAction;
