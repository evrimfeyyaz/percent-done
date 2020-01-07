import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface Project {
  id: string;
  title: string;
}

export interface ProjectsState extends NormalizedEntityState<Project> {
  idByTitle: { [title: string]: string }
}

export const ADD_PROJECT = 'ADD_PROJECT';
export const EDIT_PROJECT = 'EDIT_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';

export interface AddProjectAction extends Action<typeof ADD_PROJECT> {
  project: Project;
}

export interface EditProjectAction extends Action<typeof EDIT_PROJECT> {
  project: Project;
  /**
   * The version of the project before being edited.
   */
  projectOld: Project;
}

export interface DeleteProjectAction extends Action<typeof DELETE_PROJECT> {
  project: Project;
}

export type ProjectActionTypes = AddProjectAction | EditProjectAction | DeleteProjectAction;
