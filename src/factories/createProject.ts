import { Project } from '../store/projects/types';
import { createRandomId } from '../utilities';

export const createProject = (title: string): Project => {
  return {
    id: createRandomId(),
    title,
  };
};
