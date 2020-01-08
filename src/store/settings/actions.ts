import { SET_CURRENT_DATE, SetCurrentDateAction } from './types';

export const setCurrentDate = (date: Date): SetCurrentDateAction => {
  return {
    type: SET_CURRENT_DATE,
    date,
  };
};
