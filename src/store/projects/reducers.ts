import { combineReducers, Reducer } from 'redux';
import { NormalizedEntityById } from '../types';
import { ADD_PROJECT, DELETE_PROJECT, EDIT_PROJECT, Project, ProjectActionTypes, ProjectsState } from './types';
import _ from 'lodash';

const byId: Reducer<NormalizedEntityById<Project>, ProjectActionTypes> = (state = {}, action) => {
  let project: Project;

  switch (action.type) {
    case ADD_PROJECT:
    case EDIT_PROJECT:
      project = action.project;

      return { ...state, [project.id]: project };
    case DELETE_PROJECT:
      project = action.project;

      return _.omit(state, project.id);
    default:
      return state;
  }
};

const idByTitle: Reducer<{ [title: string]: string, }, ProjectActionTypes> = (state = {}, action) => {
  let project: Project;

  switch (action.type) {
    case ADD_PROJECT:
      project = action.project;

      return { ...state, [project.title.toLowerCase()]: project.id };
    case EDIT_PROJECT:
      project = action.project;
      const { projectOld } = action;

      return { ..._.omit(state, projectOld.title.toLowerCase()), [project.title.toLowerCase()]: project.id };
    case DELETE_PROJECT:
      project = action.project;

      return _.omit(state, project.title);
    default:
      return state;
  }
};

const allIds: Reducer<string[], ProjectActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return _.uniq([...state, action.project.id]);
    case DELETE_PROJECT:
      return _.without(state, action.project.id);
    default:
      return state;
  }
};

export const projectsReducer: Reducer<ProjectsState, ProjectActionTypes> = combineReducers({
  byId,
  idByTitle,
  allIds,
});
