import { Goal } from './types';

export const isTimeTracked = (goal: Goal): boolean => {
  return typeof goal.durationInMs === 'number' && goal.durationInMs > 0;
};

export const isActiveToday = (goal: Goal): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  return goal.recurringDays[dayOfWeek]
};
