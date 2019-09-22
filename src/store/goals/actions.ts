import { ADD_GOAL, AddGoalAction, Goal } from './types';
import { createRandomId } from '../../utilities/createRandomId';

export function addGoal(goal: Goal): AddGoalAction {
  goal.id = createRandomId();

  return {
    type: ADD_GOAL,
    payload: goal,
  };
}
