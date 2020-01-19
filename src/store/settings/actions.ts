import {
  SET_CURRENT_DATE_TIMESTAMP,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SetCurrentDateTimestampAction,
  SetTimeMachineDateTimestampAction,
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
