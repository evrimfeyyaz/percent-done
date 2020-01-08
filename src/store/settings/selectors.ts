import { StoreState } from '../types';

export const getCurrentDate = (state: StoreState): Date => {
  const {currentDateTimestamp} = state.settings;

  if (currentDateTimestamp == null) throw new Error('Current date timestamp is not set.');

  return new Date(currentDateTimestamp);
};
