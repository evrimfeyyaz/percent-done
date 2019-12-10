import { StoreState } from '../store/types';
import { Goal, GoalsState } from '../store/goals/types';
import { createNormalizedEntityState } from './createNormalizedEntityState';
import { TimetableEntriesState, TimetableEntry } from '../store/timetableEntries/types';
import { convertDateToIndex } from '../utilities';
import { Project, ProjectsState } from '../store/projects/types';

interface Arguments {
  goals?: Goal[],
  timetableEntries?: TimetableEntry[],
  projects?: Project[],
}

export const createStoreState = ({ goals = [], timetableEntries = [], projects = [] }: Arguments): StoreState => {
  const timetableEntryIdsByDate: { [date: string]: string[] } = {};
  timetableEntries.forEach((entry) => {
    const dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
    timetableEntryIdsByDate[dateIdx] = timetableEntryIdsByDate[dateIdx] || [];
    timetableEntryIdsByDate[dateIdx].push(entry.id);
  });

  const projectsByTitle: { [title: string]: string } = {};
  projects.forEach((project) => {
    projectsByTitle[project.title.toLocaleLowerCase()] = project.id;
  });

  const goalsState: GoalsState = {
    ...createNormalizedEntityState(goals),
    trackedGoal: {},
  };
  const timetableEntriesState: TimetableEntriesState = {
    ...createNormalizedEntityState(timetableEntries),
    idsByDate: timetableEntryIdsByDate,
  };
  const projectsState: ProjectsState = {
    ...createNormalizedEntityState(projects),
    byTitle: projectsByTitle,
  };

  return {
    goals: goalsState,
    timetableEntries: timetableEntriesState,
    projects: projectsState,
  };
};
