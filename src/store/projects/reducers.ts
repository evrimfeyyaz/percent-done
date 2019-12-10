import { combineReducers, Reducer } from 'redux';
import { NormalizedEntityById } from '../types';
import { ADD_PROJECT, Project, ProjectActionTypes, ProjectsState } from './types';
import _ from 'lodash';

const byId: Reducer<NormalizedEntityById<Project>, ProjectActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      const project = action.project;

      return { ...state, [project.id]: project };
    default:
      return state;
  }
};

const byTitle: Reducer<{ [id: string]: string, }, ProjectActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      const project = action.project;

      return { ...state, [project.title.toLocaleLowerCase()]: project.id };
    default:
      return state;
  }
};

const allIds: Reducer<string[], ProjectActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return _.uniq([...state, action.project.id]);
    default:
      return state;
  }
};

export const projectsReducer: Reducer<ProjectsState> = combineReducers({
  byId,
  byTitle,
  allIds,
});
