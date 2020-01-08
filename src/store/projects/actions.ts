import {
  ADD_PROJECT,
  AddProjectAction,
  DELETE_PROJECT,
  DeleteProjectAction,
  EDIT_PROJECT,
  EditProjectAction,
  Project,
} from './types';
import { createRandomId } from '../../utilities';

export const addProject = (title: string): AddProjectAction => ({
  type: ADD_PROJECT,
  project: {
    id: createRandomId(),
    title,
  },
});

export const editProject = (project: Project, projectOld: Project): EditProjectAction => ({
  type: EDIT_PROJECT,
  project,
  projectOld,
});
