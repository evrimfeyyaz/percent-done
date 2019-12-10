import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface Project {
  id: string;
  title: string;
}

export interface ProjectsState extends NormalizedEntityState<Project> {
  byTitle: { [title: string]: string }
}

export const ADD_PROJECT = 'ADD_PROJECT';

export interface AddProjectAction extends Action<typeof ADD_PROJECT> {
  project: Project;
}

export type ProjectActionTypes = AddProjectAction;
