import { AnyAction, combineReducers, Reducer } from 'redux';
import { Goal, GoalsState } from './types';
import { NormalizedEntityById } from '../types';

const byId: Reducer<NormalizedEntityById<Goal>, AnyAction> = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const allIds: Reducer<string[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const goalsReducer: Reducer<GoalsState, AnyAction> = combineReducers({
  byId,
  allIds,
});
