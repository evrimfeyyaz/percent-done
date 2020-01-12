import { StoreState } from '../store/types';
import { Goal, GoalsState } from '../store/goals/types';
import { createNormalizedEntityState } from './createNormalizedEntityState';
import { TimetableEntriesState, TimetableEntry } from '../store/timetableEntries/types';
import { convertDateToIndex } from '../utilities';
import { Project, ProjectsState } from '../store/projects/types';
import { SettingsState } from '../store/settings/types';

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

  const projectIdsByTitle: { [title: string]: string } = {};
  projects.forEach((project) => {
    projectIdsByTitle[project.title.toLocaleLowerCase()] = project.id;
  });

  const entryIdsByProjectId: { [projectId: string]: string[] } = {};
  timetableEntries.forEach(entry => {
    const projectId = entry.projectId;

    if (projectId == null) return;

    const entryIds = entryIdsByProjectId[projectId] || [];

    entryIdsByProjectId[projectId] = [...entryIds, entry.id];
  });

  const goalsState: GoalsState = {
    ...createNormalizedEntityState(goals),
    trackedGoal: {},
  };
  const timetableEntriesState: TimetableEntriesState = {
    ...createNormalizedEntityState(timetableEntries),
    idsByDate: timetableEntryIdsByDate,
    idsByProjectId: entryIdsByProjectId,
  };
  const projectsState: ProjectsState = {
    ...createNormalizedEntityState(projects),
    idByTitle: projectIdsByTitle,
  };

  const settingsState: SettingsState = {
    currentDateTimestamp: Date.now(),
  };

  return {
    goals: goalsState,
    timetableEntries: timetableEntriesState,
    projects: projectsState,
    settings: settingsState,
  };
};
