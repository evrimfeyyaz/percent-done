import { combineReducers, Reducer } from 'redux';
import {
  ADD_GOAL,
  Goal,
  GoalActionTypes,
  GoalsState,
  REMOVE_TRACKED_GOAL,
  SET_TRACKED_GOAL,
  TrackedGoalState,
  UPDATE_TRACKED_GOAL_START_TIMESTAMP,
} from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';

const byId: Reducer<NormalizedEntityById<Goal>, GoalActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_GOAL:
      const goal = action.goal;

      return { ...state, [goal.id]: goal };
    default:
      return state;
  }
};

const allIds: Reducer<string[], GoalActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return _.uniq([...state, action.goal.id]);
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
    default:
      return state;
  }
};

export const goalsReducer: Reducer<GoalsState, GoalActionTypes> = combineReducers({
  byId,
  allIds,
  trackedGoal,
});
