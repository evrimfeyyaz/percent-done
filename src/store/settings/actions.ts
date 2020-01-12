import { SET_CURRENT_DATE_TIMESTAMP, SetCurrentDateTimestampAction } from './types';

export const setCurrentDateTimestamp = (timestamp: number): SetCurrentDateTimestampAction => {
  return {
    type: SET_CURRENT_DATE_TIMESTAMP,
    timestamp,
  };
};
