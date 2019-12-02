import {
  ADD_GOAL,
  AddGoalAction, DELETE_GOAL, DeleteGoalAction, EDIT_GOAL, EditGoalAction,
  Goal, REMOVE_TRACKED_GOAL, RemoveTrackedGoalAction, SET_TRACKED_GOAL,
  SetTrackedGoalAction, UPDATE_TRACKED_GOAL_START_TIMESTAMP, UpdateTrackedGoalStartTimestampAction,
} from './types';
import { ActionCreator } from 'redux';

export const addGoal = (goal: Goal): AddGoalAction => ({
  type: ADD_GOAL,
  goal,
});

export const editGoal = (goal: Goal): EditGoalAction => ({
  type: EDIT_GOAL,
  goal,
});

export const deleteGoal = (goalId: string): DeleteGoalAction => ({
  type: DELETE_GOAL,
  goalId,
});

export const setTrackedGoal = (goalId: string, startTimestamp: number): SetTrackedGoalAction => ({
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
