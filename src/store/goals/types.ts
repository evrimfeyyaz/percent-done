import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface Goal {
  id: string;
  title: string;
  /**
   * Index of the color within the `goalColors` constant in the
   * `colors.ts` file.
   */
  colorIndex: number;
  durationInMs?: number;
  /**
   * Index `0` is "Sunday," and so on.
   */
  recurringDays: boolean[];
  /**
   * The ID of the project that was last associated with this goal
   * while it was being tracked.
   */
  lastProjectId?: string;
  createdAtTimestamp: number;
  deletedAtTimestamp?: number;
}

export interface TrackedGoalState {
  id?: string;
  startTimestamp?: number;
  projectId?: string;
}

export interface GoalsState extends NormalizedEntityState<Goal> {
  trackedGoal: TrackedGoalState;
}

export const ADD_GOAL = 'ADD_GOAL';
export const EDIT_GOAL = 'EDIT_GOAL';
export const DELETE_GOAL = 'DELETE_GOAL';
export const SET_TRACKED_GOAL = 'SET_TRACKED_GOAL';
export const REMOVE_TRACKED_GOAL = 'REMOVE_TRACKED_GOAL';
export const UPDATE_TRACKED_GOAL_START_TIMESTAMP = 'UPDATE_TRACKED_GOAL_START_TIMESTAMP';
export const UPDATE_TRACKED_GOAL_PROJECT_ID = 'UPDATE_TRACKED_GOAL_PROJECT_ID';

export interface AddGoalAction extends Action<typeof ADD_GOAL> {
  goal: Goal;
}

export interface EditGoalAction extends Action<typeof EDIT_GOAL> {
  goal: Goal;
}

export interface DeleteGoalAction extends Action<typeof DELETE_GOAL> {
  goalId: string;
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

export interface UpdateTrackedGoalProjectIdAction extends Action<typeof UPDATE_TRACKED_GOAL_PROJECT_ID> {
  projectId: string | undefined;
  goalId: string;
}

export type GoalActionTypes =
  AddGoalAction |
  EditGoalAction |
  DeleteGoalAction |
  SetTrackedGoalAction |
  RemoveTrackedGoalAction |
  UpdateTrackedGoalStartTimestampAction |
  UpdateTrackedGoalProjectIdAction;
