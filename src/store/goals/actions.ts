import { ADD_GOAL, AddGoalAction, Goal } from './types';
export function addGoal(goal: Goal): AddGoalAction {
  return {
    type: ADD_GOAL,
    payload: goal,
  };
}
