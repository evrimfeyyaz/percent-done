import { SET_CURRENT_DATE_TIMESTAMP, SettingsActionTypes, SettingsState } from './types';
import { Reducer } from 'redux';

export const settingsReducer: Reducer<SettingsState, SettingsActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_DATE_TIMESTAMP: {
      return { ...state, currentDateTimestamp: action.timestamp };
    }
    default:
      return state;
  }
};
