import {
  ADD_GOAL,
  AddGoalAction,
  DELETE_GOAL,
  DeleteGoalAction,
  EDIT_GOAL,
  EditGoalAction,
  Goal,
  REMOVE_TRACKED_GOAL,
  RemoveTrackedGoalAction,
  SET_TRACKED_GOAL,
  SetTrackedGoalAction, UPDATE_TRACKED_GOAL_PROJECT_ID,
  UpdateTrackedGoalProjectIdAction,
} from './types';
import { createRandomId } from '../../utilities';
import { WithOptionalId } from '../../utilities/types';

export const addGoal = (goal: WithOptionalId<Goal>): AddGoalAction => ({
  type: ADD_GOAL,
  goal: { ...goal, id: createRandomId() },
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

export const removeTrackedGoal = (): RemoveTrackedGoalAction => ({
  type: REMOVE_TRACKED_GOAL,
});

export const updateTrackedGoalProjectId = (projectId: string | undefined): UpdateTrackedGoalProjectIdAction => ({
  type: UPDATE_TRACKED_GOAL_PROJECT_ID,
  projectId,
});
