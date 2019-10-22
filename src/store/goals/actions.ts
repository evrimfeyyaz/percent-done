import {
  ADD_GOAL,
  AddGoalAction, EDIT_GOAL, EditGoalAction,
  Goal, REMOVE_TRACKED_GOAL, RemoveTrackedGoalAction, SET_TRACKED_GOAL,
  SetTrackedGoalAction, UPDATE_TRACKED_GOAL_START_TIMESTAMP, UpdateTrackedGoalStartTimestampAction,
} from './types';
import { ActionCreator } from 'redux';

export const addGoal: ActionCreator<AddGoalAction> = (goal: Goal) => ({
  type: ADD_GOAL,
  goal: goal,
});

export const editGoal: ActionCreator<EditGoalAction> = (goal: Goal) => ({
  type: EDIT_GOAL,
  goal: goal,
});

export const setTrackedGoal: ActionCreator<SetTrackedGoalAction> = (goalId: string, startTimestamp: number) => ({
  type: SET_TRACKED_GOAL,
  id: goalId,
  startTimestamp,
});

export const removeTrackedGoal: ActionCreator<RemoveTrackedGoalAction> = () => ({
  type: REMOVE_TRACKED_GOAL,
});

export const updateTrackedGoalStartTimestamp: ActionCreator<UpdateTrackedGoalStartTimestampAction> = (startTimestamp: number) => ({
  type: UPDATE_TRACKED_GOAL_START_TIMESTAMP,
  startTimestamp,
});
