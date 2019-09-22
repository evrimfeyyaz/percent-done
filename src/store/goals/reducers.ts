import { combineReducers, Reducer } from 'redux';
import { ADD_GOAL, Goal, GoalActionTypes, GoalsState } from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';

const byId: Reducer<NormalizedEntityById<Goal>, GoalActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_GOAL:
      const goal = action.payload;

      return { ...state, [goal.id]: goal };
    default:
      return state;
  }
};

const allIds: Reducer<string[], GoalActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return _.uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export const goalsReducer: Reducer<GoalsState, GoalActionTypes> = combineReducers({
  byId,
  allIds,
});
