import { Goal } from './types';
import { momentWithDeviceLocale } from '../../utilities';

export const isTimeTracked = (goal: Goal): boolean => {
  return typeof goal.durationInMs === 'number' && goal.durationInMs > 0;
};

export const isActiveToday = (goal: Goal): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  return goal.recurringDays[dayOfWeek];
};

/**
 * Returns `true` if the given goal was deleted before or on the given date.
 */
export const isDeleted = (goal: Goal, date: Date): boolean => {
  if (goal.deletedAtTimestamp == null) return false;

  const dateMoment = momentWithDeviceLocale(date);
  const deletedMoment = momentWithDeviceLocale(goal.deletedAtTimestamp);
  return dateMoment.diff(deletedMoment, 'days') >= 0;
};
