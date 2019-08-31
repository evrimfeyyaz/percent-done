import { GET_INCOMPLETE_GOALS } from './types';

export function getIncompleteGoals(date: Date) {
  return {
    type: GET_INCOMPLETE_GOALS,
    date,
  };
}
