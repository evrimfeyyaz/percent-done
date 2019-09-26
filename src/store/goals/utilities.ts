import { Goal } from './types';

export const isTimeTracked = (goal: Goal): boolean => {
  return typeof goal.durationInSeconds === 'number' && goal.durationInSeconds > 0;
};
