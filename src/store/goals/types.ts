import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface Goal {
  id: string;
  title: string;
  color: string;
  durationInMs?: number;
  /**
   *
   */
  recurringDays: boolean[];
  reminderTime?: Date;
}

export interface TrackedGoalState {
  id?: string;
  startTimestamp?: number;
}

export interface GoalsState extends NormalizedEntityState<Goal> {
  trackedGoal: TrackedGoalState;
}


export const ADD_GOAL = 'ADD_GOAL';
export const EDIT_GOAL = 'EDIT_GOAL';
export const SET_TRACKED_GOAL = 'SET_TRACKED_GOAL';
export const REMOVE_TRACKED_GOAL = 'REMOVE_TRACKED_GOAL';
export const UPDATE_TRACKED_GOAL_START_TIMESTAMP = 'UPDATE_TRACKED_GOAL_START_TIMESTAMP';

export interface AddGoalAction extends Action<typeof ADD_GOAL> {
  goal: Goal;
}

export interface EditGoalAction extends Action<typeof EDIT_GOAL> {
  goal: Goal;
}

export interface SetTrackedGoalAction extends Action<typeof SET_TRACKED_GOAL> {
  id: string;
  startTimestamp: number;
}

export interface RemoveTrackedGoalAction extends Action<typeof REMOVE_TRACKED_GOAL> {
}

export interface UpdateTrackedGoalStartTimestampAction extends Action<typeof UPDATE_TRACKED_GOAL_START_TIMESTAMP> {
  startTimestamp: number;
}

export type GoalActionTypes =
  AddGoalAction |
  EditGoalAction |
  SetTrackedGoalAction |
  RemoveTrackedGoalAction |
  UpdateTrackedGoalStartTimestampAction;
