import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface Goal {
  id: string;
  title: string;
  color: string;
  durationInSeconds?: number;
  recurringDays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[];
  reminderTime?: Date;
}

export interface GoalsState extends NormalizedEntityState<Goal> {
  currentTrackedGoalId: string;
}


export const ADD_GOAL = 'ADD_GOAL';
export const SET_CURRENT_TRACKED_GOAL_ID = 'SET_CURRENT_TRACKED_GOAL_ID';

export interface AddGoalAction extends Action<typeof ADD_GOAL> {
  goal: Goal;
}

export interface SetCurrentTrackedGoalIdAction extends Action<typeof SET_CURRENT_TRACKED_GOAL_ID> {
  goalId: string;
}

export type GoalActionTypes =
  AddGoalAction |
  SetCurrentTrackedGoalIdAction;
