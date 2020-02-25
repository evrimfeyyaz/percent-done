import { StoreState } from '../store/types';
import { Goal, GoalsState, TrackedGoalState } from '../store/goals/types';
import { createNormalizedEntityState } from './createNormalizedEntityState';
import { TimetableEntriesState, TimetableEntry } from '../store/timetableEntries/types';
import { convertDateToIndex } from '../utilities';
import { Project, ProjectsState } from '../store/projects/types';
import { SettingsState } from '../store/settings/types';

interface Arguments {
  goals?: Goal[];
  timetableEntries?: TimetableEntry[];
  projects?: Project[];
  trackedGoal?: TrackedGoalState;
  settings?: Partial<SettingsState>;
}

export const createStoreState = ({ goals = [], timetableEntries = [], projects = [], trackedGoal, settings }: Arguments): StoreState => {
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

  const entryIdsByGoalId: { [goalId: string]: string[] } = {};
  timetableEntries.forEach(entry => {
    const goalId = entry.goalId;

    const entryIds = entryIdsByGoalId[goalId] || [];

    entryIdsByGoalId[goalId] = [...entryIds, entry.id];
  });

  const goalsState: GoalsState = {
    ...createNormalizedEntityState(goals),
    trackedGoal: trackedGoal ?? {},
  };
  const timetableEntriesState: TimetableEntriesState = {
    ...createNormalizedEntityState(timetableEntries),
    idsByDate: timetableEntryIdsByDate,
    idsByProjectId: entryIdsByProjectId,
    idsByGoalId: entryIdsByGoalId,
  };
  const projectsState: ProjectsState = {
    ...createNormalizedEntityState(projects),
    idByTitle: projectIdsByTitle,
  };

  const settingsState: SettingsState = {
    currentDateTimestamp: Date.now(),
    hasOnboarded: true,
    timeMachineDateTimestamp: Date.now(),
    statsPeriodKey: '7',
    ...settings,
  };

  return {
    goals: goalsState,
    timetableEntries: timetableEntriesState,
    projects: projectsState,
    settings: settingsState,
  };
};
