import { StoreState } from '../types';
import { Project } from './types';
import { getTimetableEntryById } from '../timetableEntries/selectors';

export const getAllProjects = (state: StoreState) => {
  return state.projects.allIds.map(id => state.projects.byId[id]);
};

export const getProjectByTitle = (state: StoreState, title: string): (Project | null) => {
  const id = state.projects.idByTitle[title.toLocaleLowerCase()];

  return state.projects.byId[id] || null;
};

export const getTotalTimeSpentOnProjectInMs = (state: StoreState, id: string): number => {
  const timetableEntryIdsForProject = state.timetableEntries.idsByProjectId?.[id] || [];

  return timetableEntryIdsForProject.reduce((timeSpent, entryId) => {
    const entry = getTimetableEntryById(state, entryId);
    const entryDuration = entry?.endTimestamp - entry?.startTimestamp;

    return timeSpent + entryDuration;
  }, 0)
};
