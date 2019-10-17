import { Goal } from './types';

export const isTimeTracked = (goal: Goal): boolean => {
  return typeof goal.durationInMs === 'number' && goal.durationInMs > 0;
};
