import { Action } from 'redux';

export interface SettingsState {
  currentDate?: Date;
}

export const SET_CURRENT_DATE = 'SET_CURRENT_DATE';

export interface SetCurrentDateAction extends Action<typeof SET_CURRENT_DATE> {
  date: Date;
}

export type SettingsActionTypes = SetCurrentDateAction;
