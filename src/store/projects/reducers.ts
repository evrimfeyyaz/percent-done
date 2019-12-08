import { Reducer, AnyAction, combineReducers } from 'redux';
import { NormalizedEntityById } from '../types';
import { Project, ProjectActionTypes, ProjectsState } from './types';

const byId: Reducer<NormalizedEntityById<Project>, ProjectActionTypes> = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const allIds: Reducer<string[], ProjectActionTypes> = (state = [], action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const projectsReducer: Reducer<ProjectsState, AnyAction> = combineReducers({
  byId,
  allIds,
});
