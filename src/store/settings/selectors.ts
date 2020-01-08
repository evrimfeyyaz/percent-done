import { StoreState } from '../types';

export const getCurrentDate = (state: StoreState): Date => {
  const currentDate = state.settings.currentDate;

  if (currentDate == null) throw new Error('Current date is not set.');

  return currentDate;
};
