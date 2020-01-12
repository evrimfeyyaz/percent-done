import { combineReducers, Reducer } from 'redux';
import {
  ADD_GOAL,
  DELETE_GOAL,
  EDIT_GOAL,
  Goal,
  GoalActionTypes,
  GoalsState,
  REMOVE_TRACKED_GOAL,
  SET_TRACKED_GOAL,
  TrackedGoalState, UPDATE_TRACKED_GOAL_PROJECT_ID,
  UPDATE_TRACKED_GOAL_START_TIMESTAMP,
} from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';

const byId: Reducer<NormalizedEntityById<Goal>, GoalActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_GOAL:
    case EDIT_GOAL: {
      const goal = action.goal;

      return { ...state, [goal.id]: goal };
    }
    case DELETE_GOAL: {
      const goal = state[action.goalId];

      return {
        ...state,
        [goal.id]: {
          ...goal,
          deletedAtTimestamp: Date.now(),
        },
      };
    }
    default:
      return state;
  }
};

const allIds: Reducer<string[], GoalActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      const goal = action.goal;

      return _.uniq([...state, goal.id]);
    default:
      return state;
  }
};

const trackedGoal: Reducer<TrackedGoalState, GoalActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case SET_TRACKED_GOAL:
      return {
        id: action.id,
        startTimestamp: action.startTimestamp,
      };
    case REMOVE_TRACKED_GOAL:
      return {};
    case UPDATE_TRACKED_GOAL_START_TIMESTAMP:
      return {
        ...state,
        startTimestamp: action.startTimestamp,
      };
    case UPDATE_TRACKED_GOAL_PROJECT_ID:
      return {
        ...state,
        projectId: action.projectId,
      };
    default:
      return state;
  }
};

export const goalsReducer: Reducer<GoalsState, GoalActionTypes> = combineReducers({
  byId,
  allIds,
  trackedGoal,
});
