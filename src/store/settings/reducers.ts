import { SET_CURRENT_DATE, SettingsActionTypes, SettingsState } from './types';
import { Reducer } from 'redux';

export const settingsReducer: Reducer<SettingsState, SettingsActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_DATE: {
      return { ...state, currentDateTimestamp: action.date.getTime() };
    }
    default:
      return state;
  }
};
