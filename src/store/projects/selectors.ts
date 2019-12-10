import { StoreState } from '../types';
import { Project } from './types';

export const getAllProjects = (state: StoreState) => {
  return state.projects.allIds.map(id => state.projects.byId[id]);
};

export const getProjectByTitle = (state: StoreState, title: string): (Project | null) => {
  const id = state.projects.byTitle[title.toLocaleLowerCase()];

  return state.projects.byId[id] || null;
};
