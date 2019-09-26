import {
  ADD_GOAL,
  AddGoalAction,
  Goal,
  SET_CURRENT_TRACKED_GOAL_ID,
  SetCurrentTrackedGoalIdAction,
} from './types';
import { ActionCreator } from 'redux';

export const addGoal: ActionCreator<AddGoalAction> = (goal: Goal) => ({
  type: ADD_GOAL,
  goal: goal,
});

export const setCurrentTrackedGoalId: ActionCreator<SetCurrentTrackedGoalIdAction> = (goalId: string) => ({
  type: SET_CURRENT_TRACKED_GOAL_ID,
  goalId: goalId,
});
