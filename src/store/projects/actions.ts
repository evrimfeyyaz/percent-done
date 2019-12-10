import { ADD_PROJECT, AddProjectAction } from './types';
import { createRandomId } from '../../utilities';

export const addProject = (title: string): AddProjectAction => ({
  type: ADD_PROJECT,
  project: {
    id: createRandomId(),
    title,
  },
});
