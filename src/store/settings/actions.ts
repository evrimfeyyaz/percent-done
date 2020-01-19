import {
  SET_CURRENT_DATE_TIMESTAMP,
  SET_STATS_PERIOD_KEY,
  SET_TIME_MACHINE_DATE_TIMESTAMP,
  SetCurrentDateTimestampAction,
  SetStatsPeriodKeyAction,
  SetTimeMachineDateTimestampAction,
  StatsPeriodKeyType,
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

export const setStatsPeriodKey = (key: StatsPeriodKeyType): SetStatsPeriodKeyAction => {
  return {
    type: SET_STATS_PERIOD_KEY,
    key,
  };
};

