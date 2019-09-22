import { NormalizedEntityState } from '../types';

export interface Goal {
  id: string;
  title: string;
  color: string;
  durationInSeconds?: number;
  recurringDays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[];
  reminderTime?: Date;
}

export const ADD_GOAL = 'ADD_GOAL';

export interface AddGoalAction {
  type: typeof ADD_GOAL;
  payload: Goal;
}

export type GoalActionTypes = AddGoalAction | { type: undefined };

export interface GoalsState extends NormalizedEntityState<Goal> {
}
