import { combineReducers, Reducer } from 'redux';
import {
  ADD_GOAL,
  Goal,
  GoalActionTypes,
  GoalsState,
  SET_CURRENT_TRACKED_GOAL_ID,
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

const currentTrackedGoalId: Reducer<string, GoalActionTypes> = (state = '', action) => {
  switch (action.type) {
    case SET_CURRENT_TRACKED_GOAL_ID:
      return action.goalId;
    default:
      return state;
  }
};

export const goalsReducer: Reducer<GoalsState, GoalActionTypes> = combineReducers({
  byId,
  allIds,
  currentTrackedGoalId,
});
